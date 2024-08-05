package main

import (
	"fmt"

	"google.golang.org/protobuf/proto"
	p "google.golang.org/protobuf/proto"
)

//go:generate protoc --go_out=paths=source_relative:./ messages.proto

func main() {

	// serialize some messages
	request := must1(proto.Marshal(&Envelope{
		Seq:  p.Uint64(42),
		Type: MessageType_Request.Enum(),
		Payload: &Envelope_Request{Request: &HelloRequest{
			Name: p.String("Mark")},
		},
		// Type: MessageType_Reply.Enum(),
		// Payload: &Envelope_Reply{Reply: &HelloReply{
		// 	Message: p.String("Hello, World!"),
		// }},
	}))

	format := "HelloRequest[%d]: %v\n"
	if request[0] == '{' {
		fmt.Printf(format, len(request), string(request))
	} else {
		fmt.Printf(format, len(request), request)
	}

	// -------------------------------------------------//

	some := &Envelope{}
	must(proto.Unmarshal(request, some))

	fmt.Printf("Seq: %#v, %v\n", some.Seq, some.GetSeq())
	fmt.Printf("Type: %#v, %v\n", some.Type, some.GetType())

	// alternatively, use a type switch: https://protobuf.dev/reference/go/go-generated/#oneof
	// switch p := some.Payload.(type) {
	// case *Envelope_RequestPayload:
	// 	fmt.Println(p.RequestPayload.Name)
	// 	...
	// }

	switch some.GetType() {

	case MessageType_Request:
		// pl := some.Payload.(*Envelope_Request).Request
		payload := some.GetRequest()
		has("Request", payload != nil)
		fmt.Printf("Name: %#v, %v\n", payload.Name, payload.GetName())

	case MessageType_Reply:
		payload := some.GetReply()
		has("Reply", payload != nil)
		fmt.Printf("Name: %#v, %v\n", payload.Message, payload.GetMessage())

	default:
		fmt.Println("MessageType was unset or UNKNOWN")

	}

}

func must1[T any](value T, err error) T {
	if err != nil {
		panic(err)
	}
	return value
}

func must(err error) {
	if err != nil {
		panic(err)
	}
}

func has(expected string, must bool) {
	if !must {
		panic(fmt.Sprintf("oops, expected %s payload is nil", expected))
	}
}
