package main

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/sha256"
	"crypto/tls"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/hex"
	"fmt"
	"log"
	"math/big"
	"net/http"
	"sync/atomic"
	"time"

	"github.com/gorilla/websocket"
	"github.com/quic-go/quic-go"
	"github.com/quic-go/quic-go/http3"
	"github.com/quic-go/webtransport-go"
	"google.golang.org/protobuf/encoding/protodelim"
	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/known/anypb"
)

//go:generate protoc --go_out=paths=source_relative:./ messages.proto

const TLS_CRT = "localhost.crt"
const TLS_KEY = "localhost.key"

// global sequence counter
var seq atomic.Uint64

func main() {

	// ephemeral TLS
	tlsconf, certhash := EphemeralTLS()

	// hello world in root
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("content-type", "text/plain")
		w.Write([]byte("Hello, World!"))
	})

	// new HTTP + WebSocket server
	http.HandleFunc("/websocket", func(w http.ResponseWriter, r *http.Request) {
		upgrader := websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool { return true },
		}
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Fatal(err)
		}

		log.Println("WebSocket client connected")
		for {
			letter := NewLetter()
			m, _ := proto.Marshal(letter)
			if err := conn.WriteMessage(websocket.BinaryMessage, m); err != nil {
				log.Printf("ws to %s failed: %s", conn.RemoteAddr(), err)
				conn.Close()
				return
			}
			log.Printf("sent hello %d to %s", letter.Id, conn.RemoteAddr())
			// time.Sleep(1 * time.Second)
		}
	})
	hserver := &http.Server{
		Addr:      "127.0.0.1:4080",
		TLSConfig: tlsconf,
	}
	go func() {
		log.Printf("websocket listening on https://127.0.0.1:4080/websocket")
		if err := hserver.ListenAndServeTLS("", ""); err != nil {
			log.Fatalf("oops: %s", err)
		}
	}()

	// new HTTP/3 server
	server := webtransport.Server{
		H3: http3.Server{
			Addr:      "127.0.0.1:4443",
			TLSConfig: tlsconf,
			QUICConfig: &quic.Config{
				MaxIdleTimeout:  2 * time.Second,
				KeepAlivePeriod: 1 * time.Second,
			},
		},
		CheckOrigin: func(r *http.Request) bool { return true },
	}
	defer server.Close()

	// register the WebTransport endpoint
	http.HandleFunc("/webtransport", func(w http.ResponseWriter, r *http.Request) {

		// connection upgrade
		log.Println("new HTTP/3 connection, upgrading to WebTransport")
		conn, err := server.Upgrade(w, r)
		if err != nil {
			log.Printf("connection upgrade failed: %s", err)
			w.WriteHeader(500)
			return
		}

		// open a bidirectional stream
		stream, err := conn.OpenStream()
		if err != nil {
			log.Printf("failed opening a bidirectional stream: %s", err)
			w.WriteHeader(500)
			return
		}

		for {
			// TODO: doesn't properly close when the client disconnects / reloads?
			letter := NewLetter()
			if _, err := protodelim.MarshalTo(stream, letter); err != nil {
				return
			}
			log.Printf("sent hello %d to %s", letter.Id, conn.RemoteAddr())
			time.Sleep(10 * time.Second)
		}

	})

	// start listening and print ephemeral certhash
	log.Printf("webtransport listening on https://127.0.0.1:4443/webtransport")
	log.Printf("certhash: %s", certhash)
	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("oops: %s", err)
	}

}

func NewLetter() *Envelope {
	hello, _ := anypb.New(&HelloRequest{Name: "Mark"})
	return &Envelope{
		Id:      seq.Add(1),
		Type:    MessageType_Request,
		Payload: hello,
	}
}

// generate a short-lived self-signed certificate for use with the webtransport socket
func EphemeralWebTransportCert() (*x509.Certificate, *ecdsa.PrivateKey, error) {

	// #######################################################################################
	// #                                                                                     #
	// # From https://w3c.github.io/webtransport/#custom-certificate-requirements:           #
	// #                                                                                     #
	// #   The custom certificate requirements are as follows: the certificate MUST be an    #
	// #   X.509v3 certificate as defined in [RFC5280], the key used in the Subject Public   #
	// #   Key field MUST be one of the allowed public key algorithms, the current time      #
	// #   MUST be within the validity period of the certificate as defined in Section       #
	// #   4.1.2.5 of [RFC5280] and the total length of the validity period MUST NOT         #
	// #   exceed two weeks. The user agent MAY impose additional implementation-defined     #
	// #   requirements on the certificate.                                                  #
	// #                                                                                     #
	// #   The exact list of allowed public key algorithms used in the Subject Public Key    #
	// #   Info field (and, as a consequence, in the TLS CertificateVerify message) is       #
	// #   implementation-defined; however, it MUST include ECDSA with the secp256r1         #
	// #   (NIST P-256) named group ([RFC3279], Section 2.3.5; [RFC8422]) to provide an      #
	// #   interoperable default. It MUST NOT contain RSA keys ([RFC3279], Section 2.3.1).   #
	// #                                                                                     #
	// #######################################################################################

	// random serial number
	serial, err := rand.Int(rand.Reader, new(big.Int).Lsh(big.NewInt(1), 128))
	if err != nil {
		return nil, nil, fmt.Errorf("cannot generate serial number: %w", err)
	}

	// generate a p256 private key
	privkey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		return nil, nil, fmt.Errorf("cannot generate private key: %w", err)
	}

	// create the certificate template
	now := time.Now()
	template := x509.Certificate{
		SerialNumber: serial,
		// maximum validity period of two weeks
		NotBefore: now,
		NotAfter:  now.Add(14 * 24 * time.Hour),
		// generic project-related subject
		Subject: pkix.Name{
			Organization: []string{"project: wasimoff"},
			CommonName:   "wasimoff webtransport socket",
		},
		// only for use as server certificate
		KeyUsage:              x509.KeyUsageDigitalSignature, // only RSA should have KeyEncipherment
		ExtKeyUsage:           []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
		IsCA:                  false,
		BasicConstraintsValid: true,
	}

	// generate certificate bytes
	der, err := x509.CreateCertificate(rand.Reader, &template, &template, &privkey.PublicKey, privkey)
	if err != nil {
		return nil, nil, fmt.Errorf("cannot create certificate: %w", err)
	}
	cert, err := x509.ParseCertificate(der)
	if err != nil {
		return nil, nil, fmt.Errorf("cannot parse generated certificate: %w", err)
	}

	return cert, privkey, nil
}

func EphemeralTLS() (*tls.Config, string) {
	// generate new random keypair
	cert, privkey, err := EphemeralWebTransportCert()
	if err != nil {
		log.Fatalf("failed generating keypair: %w", err)
	}
	// construct a certificate from it
	newcert := tls.Certificate{
		Certificate: [][]byte{cert.Raw},
		Leaf:        cert,
		PrivateKey:  privkey,
	}
	// create a tls.Config using it
	conf := &tls.Config{
		Certificates: []tls.Certificate{newcert},
	}
	sum := sha256.Sum256(newcert.Leaf.Raw)
	certhash := hex.EncodeToString(sum[:])
	return conf, certhash
}
