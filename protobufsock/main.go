package main

import (
	"bufio"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"regexp"
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
	// MARK: WebSocket

	// push received counter to channel or close it when done
	pushNext := func(counter *Counter, sequence chan uint64) bool {
		if (counter.Seq % (countTo / 10)) == 0 {
			fmt.Printf("%d .. ", counter.Seq)
		}
		if counter.Seq == countTo {
			close(sequence)
			return false
		} else {
			sequence <- counter.Seq
		}
		return true
	}

	// prepare the next counter with fresh random data
	prepareCounter := func(seq uint64) *Counter {
		counter := &Counter{Seq: seq}
		if addNoise > 0 {
			counter.Noise = noise(addNoise)
		}
		return counter
	}

	// websocket benchmark stub
	WebSocketBench := func(name string, bench func(*websocket.Conn, chan uint64)) {
		path := cleanpath(name) // cleaned name for http route and result key
		http.HandleFunc("/"+path, func(w http.ResponseWriter, r *http.Request) {
			upgrader := websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}
			conn, err := upgrader.Upgrade(w, r, nil)
			if err != nil {
				log.Fatal(err)
			}
			defer conn.Close()
			// count to limit and measure time
			t0 := time.Now().UnixMilli()
			fmt.Printf("run \033[1m%s\033[0m benchmark with %s\n", name, conn.RemoteAddr())
			sequence := make(chan uint64, 10)
			sequence <- 0
			// inner benchmark loop
			bench(conn, sequence)
			// measure elapsed time
			elapsed := time.Now().UnixMilli() - t0
			fmt.Printf("done! \033[1m%d ms\033[0m\n", elapsed)
			// maybe replace result key with query parameter
			if key := r.URL.Query().Get("key"); key != "" {
				path = key
			}
			results[path] = elapsed
		})
	}

	WebSocketBench( // websocket/protobuf
		"\033[32mwebsocket/\033[31mprotobuf\033[0m",
		func(conn *websocket.Conn, sequence chan uint64) {
			// receiver
			go func() {
				for {
					mt, buf, err := conn.ReadMessage()
					if err != nil || mt != websocket.BinaryMessage {
						log.Fatalf("reading message: %v, %s", mt, err)
					}
					counter := new(Counter)
					if err := proto.Unmarshal(buf, counter); err != nil {
						log.Fatalf("unmarshal: %s", err)
					}
					if !pushNext(counter, sequence) {
						return
					}
				}
			}()
			// sender
			for seq := range sequence {
				buf, err := proto.Marshal(prepareCounter(seq))
				if err != nil {
					log.Fatalf("marshalling counter: %s", err)
				}
				if err := conn.WriteMessage(websocket.BinaryMessage, buf); err != nil {
					log.Fatalf("writing message: %s", err)
				}
			}
		},
	)

	WebSocketBench( // websocket/json
		"\033[32mwebsocket/\033[35mjson\033[0m",
		func(conn *websocket.Conn, sequence chan uint64) {
			// receiver
			go func() {
				for {
					counter := new(Counter)
					if err := conn.ReadJSON(counter); err != nil {
						log.Fatalf("unmarshal: %s", err)
					}
					if !pushNext(counter, sequence) {
						return
					}
				}
			}()
			// sender
			for seq := range sequence {
				if err := conn.WriteJSON(prepareCounter(seq)); err != nil {
					log.Fatalf("writing message: %s", err)
				}
			}
		},
	)

	WebSocketBench( // websocket/messagepack
		"\033[32mwebsocket/\033[33mmessagepack\033[0m",
		func(conn *websocket.Conn, sequence chan uint64) {
			// receiver
			go func() {
				for {
					mt, buf, err := conn.ReadMessage()
					if err != nil || mt != websocket.BinaryMessage {
						log.Fatalf("reading message: %v, %s", mt, err)
					}
					counter := new(Counter)
					if err := msgpack.Unmarshal(buf, counter); err != nil {
						log.Fatalf("unmarshal: %s", err)
					}
					if !pushNext(counter, sequence) {
						return
					}
				}
			}()
			// sender
			for seq := range sequence {
				buf, err := msgpack.Marshal(prepareCounter(seq))
				if err != nil {
					log.Fatalf("marshalling counter: %s", err)
				}
				if err := conn.WriteMessage(websocket.BinaryMessage, buf); err != nil {
					log.Fatalf("writing message: %s", err)
				}
			}
		},
	)

	// start the https server for websocket
	go func() {
		hserver := &http.Server{Addr: ":4080", TLSConfig: tlsconf}
		log.Printf("websocket listening on https://:4080/websocket")
		if err := hserver.ListenAndServeTLS("", ""); err != nil {
			log.Fatalf("oops: %s", err)
		}
	}()

	// ---------- webtransport ---------- //
	// MARK: WebTransport

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

	// webtransport benchmark stub
	WebTransportBench := func(name string, bench func(webtransport.Stream, chan uint64)) {
		path := cleanpath(name) // cleaned name for http route and result key
		http.HandleFunc("/"+path, func(w http.ResponseWriter, r *http.Request) {
			conn, err := server.Upgrade(w, r)
			if err != nil {
				log.Fatal(err)
			}
			defer conn.CloseWithError(0, "bye")
			// open a bidirectional stream
			stream, err := conn.OpenStream()
			if err != nil {
				log.Fatalf("failed opening a bidirectional stream: %s", err)
			}
			defer stream.Close()
			// count to limit and measure time
			t0 := time.Now().UnixMilli()
			fmt.Printf("run \033[1m%s\033[0m benchmark with %s\n", name, conn.RemoteAddr())
			sequence := make(chan uint64, 10)
			sequence <- 0
			// inner benchmark loop
			bench(stream, sequence)
			// measure elapsed time
			elapsed := time.Now().UnixMilli() - t0
			fmt.Printf("done! \033[1m%d ms\033[0m\n", elapsed)
			// maybe replace result key with query parameter
			if key := r.URL.Query().Get("key"); key != "" {
				path = key
			}
			results[path] = elapsed
		})
	}

	WebTransportBench( // webtransport/protobuf
		"\033[34mwebtransport/\033[31mprotobuf\033[0m",
		func(stream webtransport.Stream, sequence chan uint64) {
			// receiver
			go func() {
				reader := bufio.NewReader(stream)
				for {
					counter := new(Counter)
					if err := protodelim.UnmarshalFrom(reader, counter); err != nil {
						log.Fatalf("unmarshal: %s", err)
					}
					if !pushNext(counter, sequence) {
						return
					}
				}
			}()
			// sender
			for seq := range sequence {
				if _, err := protodelim.MarshalTo(stream, prepareCounter(seq)); err != nil {
					log.Fatalf("marshalling counter: %s", err)
				}
			}
		},
	)

	WebTransportBench( // webtransport/messagepack
		"\033[34mwebtransport/\033[33mmessagepack\033[0m",
		func(stream webtransport.Stream, sequence chan uint64) {
			// receiver
			go func() {
				decoder := msgpack.NewDecoder(stream)
				for {
					counter := new(Counter)
					if err := decoder.Decode(counter); err != nil {
						log.Fatalf("unmarshal: %s", err)
					}
					if !pushNext(counter, sequence) {
						return
					}
				}
			}()
			// sender
			encoder := msgpack.NewEncoder(stream)
			for seq := range sequence {
				if err := encoder.Encode(prepareCounter(seq)); err != nil {
					log.Fatalf("marshalling counter: %s", err)
				}
			}
		},
	)

	// start listening and print certhash
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

// strip ansi control sequences and any non-path characters
func cleanpath(s string) string {
	// modified from https://github.com/acarl005/stripansi (MIT License, Copyright (c) 2018 Andrew Carlson)
	var strip = regexp.MustCompile("([\u001B\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\u0007)|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))|[^a-z/-_])")
	return strip.ReplaceAllString(s, "")
}
