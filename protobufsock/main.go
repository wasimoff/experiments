package main

import (
	"bufio"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync/atomic"
	"time"

	"github.com/gorilla/websocket"
	"github.com/quic-go/quic-go"
	"github.com/quic-go/quic-go/http3"
	"github.com/quic-go/webtransport-go"
	"github.com/vmihailenco/msgpack/v5"
	"google.golang.org/protobuf/encoding/protodelim"
	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/known/anypb"
)

//! generate the protobuf definitions
//go:generate protoc --go_out=paths=source_relative:./ messages.proto

// global sequence counter
var globalSequence atomic.Uint64

const countTo = 10000
const addNoise = 2048

func main() {

	// ephemeral TLS
	tlsconf, certhash := EphemeralTLS()

	// hello world in root, just to have something to accept selfsigned cert
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("content-type", "text/plain")
		w.Write([]byte("Hello, World!"))
	})

	// ---------- websocket ---------- //

	// --> protobuf benchmark
	http.HandleFunc("/websocket/bench/proto", func(w http.ResponseWriter, r *http.Request) {
		upgrader := websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Fatal(err)
		}
		// log.Printf("WebSocket client connected: %s\n", conn.RemoteAddr())
		defer conn.Close()

		// count to limit and measure time
		t0 := time.Now().UnixMilli()
		fmt.Printf("starting ws://proto bench at %d\n", t0)
		sequence := make(chan uint64, 10)
		sequence <- 0
		// receiver
		go func() {
			for {
				mt, buf, err := conn.ReadMessage()
				if err != nil || mt != websocket.BinaryMessage {
					log.Fatalf("reading message: %v, %s", mt, err)
				}
				ct := new(Counter)
				if err := proto.Unmarshal(buf, ct); err != nil {
					log.Fatalf("unmarshal: %s", err)
				}
				if (ct.Seq % 1000) == 0 {
					fmt.Printf("%d .. ", ct.Seq)
				}
				if ct.Seq == countTo {
					fmt.Printf("done!\n")
					close(sequence)
					return
				} else {
					sequence <- ct.Seq
				}
			}
		}()
		// sender
		for seq := range sequence {
			counter := &Counter{Seq: seq}
			if addNoise > 0 {
				counter.Noise = noise(addNoise)
			}
			m, err := proto.Marshal(counter)
			if err != nil {
				log.Fatalf("marshalling counter: %s", err)
			}
			if err := conn.WriteMessage(websocket.BinaryMessage, m); err != nil {
				log.Fatalf("writing message: %s", err)
			}
		}
		// measure elapsed time
		t1 := time.Now().UnixMilli()
		fmt.Printf("\033[32mws://proto\033[0m benchmark with %s took \033[1m%d ms\033[0m\n", conn.RemoteAddr(), t1-t0)
	})

	// --> json benchmark
	http.HandleFunc("/websocket/bench/json", func(w http.ResponseWriter, r *http.Request) {
		upgrader := websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Fatal(err)
		}
		// log.Printf("WebSocket client connected: %s\n", conn.RemoteAddr())
		defer conn.Close()

		// count to limit and measure time
		t0 := time.Now().UnixMilli()
		fmt.Printf("starting ws://json bench at %d\n", t0)
		sequence := make(chan uint64, 10)
		sequence <- 0
		// receiver
		go func() {
			for {
				mt, buf, err := conn.ReadMessage()
				if err != nil || mt != websocket.TextMessage {
					log.Fatalf("reading message: %v, %s", mt, err)
				}
				ct := new(Counter)
				if err := json.Unmarshal(buf, ct); err != nil {
					log.Fatalf("unmarshal: %s", err)
				}
				if (ct.Seq % 1000) == 0 {
					fmt.Printf("%d .. ", ct.Seq)
				}
				if ct.Seq == countTo {
					fmt.Printf("done!\n")
					close(sequence)
					return
				} else {
					sequence <- ct.Seq
				}
			}
		}()
		// sender
		for seq := range sequence {
			counter := &Counter{Seq: seq}
			if addNoise > 0 {
				counter.Noise = noise(addNoise)
			}
			m, err := json.Marshal(counter)
			if err != nil {
				log.Fatalf("marshalling counter: %s", err)
			}
			if err := conn.WriteMessage(websocket.TextMessage, m); err != nil {
				log.Fatalf("writing message: %s", err)
			}
		}
		// measure elapsed time
		t1 := time.Now().UnixMilli()
		fmt.Printf("\033[36mws://json\033[0m benchmark with %s took \033[1m%d ms\033[0m\n", conn.RemoteAddr(), t1-t0)
	})

	hserver := &http.Server{
		Addr:      "127.0.0.1:4080",
		TLSConfig: tlsconf,
	}
	go func() {
		log.Printf("websocket listening on https://127.0.0.1:4080/websocket")
		if err := hserver.ListenAndServeTLS("", ""); err != nil {
			// if err := hserver.ListenAndServe(); err != nil {
			log.Fatalf("oops: %s", err)
		}
	}()

	// ---------- webtransport ---------- //

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

	// --> protobuf benchmark
	http.HandleFunc("/webtransport/bench/proto", func(w http.ResponseWriter, r *http.Request) {
		conn, err := server.Upgrade(w, r)
		if err != nil {
			log.Fatal(err)
		}
		// log.Printf("WebTransport client connected: %s\n", conn.RemoteAddr())
		defer conn.CloseWithError(0, "bye")

		// open a bidirectional stream
		stream, err := conn.OpenStream()
		if err != nil {
			log.Fatalf("failed opening a bidirectional stream: %s", err)
		}

		// count to limit and measure time
		t0 := time.Now().UnixMilli()
		fmt.Printf("starting wt://proto bench at %d\n", t0)
		sequence := make(chan uint64, 10)
		sequence <- 0
		// receiver
		go func() {
			reader := bufio.NewReader(stream)
			for {
				ct := new(Counter)
				if protodelim.UnmarshalFrom(reader, ct); err != nil {
					log.Fatalf("unmarshal: %s", err)
				}
				if (ct.Seq % 1000) == 0 {
					fmt.Printf("%d .. ", ct.Seq)
				}
				if ct.Seq == countTo {
					fmt.Printf("done!\n")
					close(sequence)
					return
				} else {
					sequence <- ct.Seq
				}
			}
		}()
		// sender
		for seq := range sequence {
			counter := &Counter{Seq: seq}
			if addNoise > 0 {
				counter.Noise = noise(addNoise)
			}
			if _, err := protodelim.MarshalTo(stream, counter); err != nil {
				log.Fatalf("marshalling counter: %s", err)
			}
		}
		// measure elapsed time
		t1 := time.Now().UnixMilli()
		fmt.Printf("\033[31mwt://proto\033[0m benchmark with %s took \033[1m%d ms\033[0m\n", conn.RemoteAddr(), t1-t0)

	})

	// --> messagepack benchmark
	http.HandleFunc("/webtransport/bench/msgp", func(w http.ResponseWriter, r *http.Request) {
		conn, err := server.Upgrade(w, r)
		if err != nil {
			log.Fatal(err)
		}
		// log.Printf("WebTransport client connected: %s\n", conn.RemoteAddr())
		defer conn.CloseWithError(0, "bye")

		// open a bidirectional stream
		stream, err := conn.OpenStream()
		if err != nil {
			log.Fatalf("failed opening a bidirectional stream: %s", err)
		}
		encoder := msgpack.NewEncoder(stream)
		decoder := msgpack.NewDecoder(stream)

		// count to limit and measure time
		t0 := time.Now().UnixMilli()
		fmt.Printf("starting wt://msgp bench at %d\n", t0)
		sequence := make(chan uint64, 10)
		sequence <- 0
		// receiver
		go func() {
			for {
				ct := new(Counter)
				if err := decoder.Decode(ct); err != nil {
					log.Fatalf("unmarshal: %s", err)
				}
				if (ct.Seq % 1000) == 0 {
					fmt.Printf("%d .. ", ct.Seq)
				}
				if ct.Seq == countTo {
					fmt.Printf("done!\n")
					close(sequence)
					return
				} else {
					sequence <- ct.Seq
				}
			}
		}()
		// sender
		for seq := range sequence {
			counter := &Counter{Seq: seq}
			if addNoise > 0 {
				counter.Noise = noise(addNoise)
			}
			if err := encoder.Encode(counter); err != nil {
				log.Fatalf("marshalling counter: %s", err)
			}
		}
		// measure elapsed time
		t1 := time.Now().UnixMilli()
		fmt.Printf("\033[33mwt://msgp\033[0m benchmark with %s took \033[1m%d ms\033[0m\n", conn.RemoteAddr(), t1-t0)

	})

	// start listening and print ephemeral certhash
	log.Printf("webtransport listening on https://127.0.0.1:4443/webtransport")
	log.Printf("certhash: %s", certhash)
	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("oops: %s", err)
	}

}

// create a new letter with a nested request in any payload
func NewLetter() *Envelope {
	hello, _ := anypb.New(&HelloRequest{Name: "Mark"})
	return &Envelope{
		Id:      globalSequence.Add(1),
		Type:    MessageType_Request,
		Payload: hello,
	}
}

// example how to send letters on websocket conn
func WsSendLetter(conn *websocket.Conn) {
	letter := NewLetter()
	m, _ := proto.Marshal(letter)
	if err := conn.WriteMessage(websocket.BinaryMessage, m); err != nil {
		log.Printf("ws to %s failed: %s", conn.RemoteAddr(), err)
		conn.Close()
		return
	}
	log.Printf("sent hello %d to %s", letter.Id, conn.RemoteAddr())
}

// get some random bytes
func noise(length int) (b []byte) {
	b = make([]byte, length)
	if _, err := rand.Read(b); err != nil {
		panic(fmt.Errorf("failed reading randomness: %w", err))
	}
	return
}
