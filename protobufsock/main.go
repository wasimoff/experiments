package main

import (
	"bufio"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
	"github.com/quic-go/quic-go"
	"github.com/quic-go/quic-go/http3"
	"github.com/quic-go/webtransport-go"
	"github.com/vmihailenco/msgpack/v5"
	"google.golang.org/protobuf/encoding/protodelim"
	"google.golang.org/protobuf/proto"
)

//! generate the protobuf definitions
//go:generate protoc --go_out=paths=source_relative:./ messages.proto

var addNoise uint64 = 0
var countTo uint64 = 1000
var results = make(map[string]int64)

func main() {

	// ephemeral TLS
	tlsconf, certhash := LoadTLS("localhost.crt", "localhost.key")

	// hello world in root, just to have something to accept selfsigned cert
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("content-type", "text/plain")
		w.Write([]byte("Hello, World!"))
	})

	// print a horizontal ruler when this route is accessed
	http.HandleFunc("/measure/new", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("access-control-allow-origin", "*")
		fmt.Println("- 8<- - - - - - - - - snip here - - - - - - - - -")
		if u, err := strconv.ParseUint(r.URL.Query().Get("count"), 10, 0); err == nil {
			countTo = u
		}
		if u, err := strconv.ParseUint(r.URL.Query().Get("noise"), 10, 0); err == nil {
			addNoise = u
		}
		results = make(map[string]int64)
		results["countTo"] = int64(countTo)
		results["addNoise"] = int64(addNoise)
	})

	// dump measurements as json when this route is accessed
	http.HandleFunc("/measure/dump", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("access-control-allow-origin", "*")
		if buf, err := json.Marshal(results); err == nil {
			w.Header().Add("content-type", "application/json")
			w.Write(buf)
			fmt.Println(string(buf))
		} else {
			w.WriteHeader(500)
		}
	})

	// ---------- websocket ---------- //

	// WebSocket + Protobuf
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
		fmt.Printf("starting ws://proto bench\n")
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
				if (ct.Seq % (countTo / 10)) == 0 {
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
		elapsed := time.Now().UnixMilli() - t0
		fmt.Printf("\033[32mws://\033[31mproto\033[0m benchmark with %s took \033[1m%d ms\033[0m\n", conn.RemoteAddr(), elapsed)
		results["ws+proto"] = elapsed
	})

	// WebSocket + JSON
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
		fmt.Printf("starting ws://json bench\n")
		sequence := make(chan uint64, 10)
		sequence <- 0
		// receiver
		go func() {
			for {
				ct := new(Counter)
				if err := conn.ReadJSON(ct); err != nil {
					log.Fatalf("unmarshal: %s", err)
				}
				if (ct.Seq % (countTo / 10)) == 0 {
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
			if err := conn.WriteJSON(counter); err != nil {
				log.Fatalf("writing message: %s", err)
			}
		}
		// measure elapsed time
		elapsed := time.Now().UnixMilli() - t0
		fmt.Printf("\033[32mws://\033[35mjson\033[0m benchmark with %s took \033[1m%d ms\033[0m\n", conn.RemoteAddr(), elapsed)
		results["ws+json"] = elapsed
	})

	// WebSocket + MessagePack
	http.HandleFunc("/websocket/bench/msgp", func(w http.ResponseWriter, r *http.Request) {
		upgrader := websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Fatal(err)
		}
		// log.Printf("WebSocket client connected: %s\n", conn.RemoteAddr())
		defer conn.Close()

		// count to limit and measure time
		t0 := time.Now().UnixMilli()
		fmt.Printf("starting ws://msgp bench\n")
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
				if err := msgpack.Unmarshal(buf, ct); err != nil {
					log.Fatalf("unmarshal: %s", err)
				}
				if (ct.Seq % (countTo / 10)) == 0 {
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
			m, err := msgpack.Marshal(counter)
			if err != nil {
				log.Fatalf("marshalling counter: %s", err)
			}
			if err := conn.WriteMessage(websocket.BinaryMessage, m); err != nil {
				log.Fatalf("writing message: %s", err)
			}
		}
		// measure elapsed time
		elapsed := time.Now().UnixMilli() - t0
		fmt.Printf("\033[32mws://\033[33mmsgp\033[0m benchmark with %s took \033[1m%d ms\033[0m\n", conn.RemoteAddr(), elapsed)
		results["ws+msgp"] = elapsed
	})

	hserver := &http.Server{
		Addr:      ":4080",
		TLSConfig: tlsconf,
	}
	go func() {
		log.Printf("websocket listening on https://:4080/websocket")
		if err := hserver.ListenAndServeTLS("", ""); err != nil {
			// if err := hserver.ListenAndServe(); err != nil {
			log.Fatalf("oops: %s", err)
		}
	}()

	// ---------- webtransport ---------- //

	// new HTTP/3 server
	server := webtransport.Server{
		H3: http3.Server{
			Addr:      ":4443",
			TLSConfig: tlsconf,
			QUICConfig: &quic.Config{
				MaxIdleTimeout:  2 * time.Second,
				KeepAlivePeriod: 1 * time.Second,
			},
		},
		CheckOrigin: func(r *http.Request) bool { return true },
	}
	defer server.Close()

	// WebTransport + Protobuf
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
		fmt.Printf("starting wt://proto bench\n")
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
				if (ct.Seq % (countTo / 10)) == 0 {
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
		elapsed := time.Now().UnixMilli() - t0
		fmt.Printf("\033[34mwt://\033[31mproto\033[0m benchmark with %s took \033[1m%d ms\033[0m\n", conn.RemoteAddr(), elapsed)
		results["wt+proto"] = elapsed
	})

	// WebTransport + MessagePack
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
		fmt.Printf("starting wt://msgp bench\n")
		sequence := make(chan uint64, 10)
		sequence <- 0
		// receiver
		go func() {
			for {
				ct := new(Counter)
				if err := decoder.Decode(ct); err != nil {
					log.Fatalf("unmarshal: %s", err)
				}
				if (ct.Seq % (countTo / 10)) == 0 {
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
		elapsed := time.Now().UnixMilli() - t0
		fmt.Printf("\033[34mwt://\033[33mmsgp\033[0m benchmark with %s took \033[1m%d ms\033[0m\n", conn.RemoteAddr(), elapsed)
		results["wt+msgp"] = elapsed
	})

	// start listening and print ephemeral certhash
	log.Printf("webtransport listening on https://:4443/webtransport")
	log.Printf("certhash: %s", certhash)
	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("oops: %s", err)
	}

}

// get some random bytes
func noise(length uint64) (b []byte) {
	b = make([]byte, length)
	if _, err := rand.Read(b); err != nil {
		panic(fmt.Errorf("failed reading randomness: %w", err))
	}
	return
}
