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
	"time"
)

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
