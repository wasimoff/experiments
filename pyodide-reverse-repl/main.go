package main

import (
	"bufio"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"

	"github.com/coder/websocket"
)

// only one listener at a time
var lock sync.Mutex

// accepts new connections
func handleWebSocket(w http.ResponseWriter, r *http.Request) {

	lock.Lock()
	defer lock.Unlock()

	// upgrade the connection
	conn, err := websocket.Accept(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}
	defer conn.Close(websocket.StatusNormalClosure, "")
	log.Println("new pyodide worker connected:", r.RemoteAddr)

	// Start reading commands from stdin and sending them to the browser
	scanner := bufio.NewScanner(os.Stdin)
	fmt.Print("> ")
	for scanner.Scan() {
		command := scanner.Text()
		if conn != nil {

			// write the command
			err := conn.Write(r.Context(), websocket.MessageText, []byte(command))
			if err != nil {
				log.Println("Write error:", err)
				break
			}

			// wait for response
			_, message, err := conn.Read(r.Context())
			if err != nil {
				log.Println("read error:", err)
				break
			}
			fmt.Println(string(message))

		}
		fmt.Print("> ")
	}
	if err := scanner.Err(); err != nil {
		log.Println("Scanner error:", err)
	}
}

func main() {
	http.HandleFunc("/ws", handleWebSocket)
	http.Handle("/", http.FileServer(http.Dir("./")))

	log.Println("starting server at http://localhost:8080")
	go func() {
		log.Fatal(http.ListenAndServe(":8080", nil))
	}()

	// Graceful shutdown
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	<-stop
	fmt.Println(" Shutting down server...")
}
