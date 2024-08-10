// - 8<- - - - explorations with protobuf.js - - - - - - - - //

import { Writer } from "protobufjs";
import messages from "./messages";

interface SomeProtoType {
  new (...args: any[]): any;
  getTypeUrl(prefix: string): string;
  encode(message: InstanceType<this>): Writer;
  }
  
function packAny<T extends SomeProtoType>(proto: T, instance: InstanceType<T> | ConstructorParameters<T>[0]) {
  return <messages.google.protobuf.IAny>{
    type_url: proto.getTypeUrl("prefix"),
    value: proto.encode(instance).finish(),
  };
};

async function explorationsWithProtobuf() {

  let request = messages.OneOfEnvelope.create({
    request: {
      seq: 33,
      request: packAny(messages.HelloRequest, { name: "Mark" }),
    },
  });
  let buf = messages.OneOfEnvelope.encode(request).finish();
  console.log(request)
  console.log(buf);
  console.log(JSON.stringify(request));

  let received = messages.OneOfEnvelope.decode(buf);
  console.log(received);
  switch (received.message) {
    case "request":
      let r = received.request!;
      console.log("Request seq", r.seq, "with payload", r.request?.type_url)

      break;
  
    default:
      console.warn("Other message types than Request not handled yet.")
      break;
  }  
};


// - 8<- - - - explorations with @bufbuild/protobuf - - - - - - - - //
import { create, toBinary, createRegistry, isMessage } from "@bufbuild/protobuf";
import { type GenMessage } from "@bufbuild/protobuf/codegenv1";
import { sizeDelimitedDecodeStream } from "@bufbuild/protobuf/wire";
import { anyPack, anyUnpack } from "@bufbuild/protobuf/wkt";
import * as es from "./genpb/messages_pb";

async function bufbuild() {

  // requiring schema everywhere is verbose but we can piggyback on the types to write shorthands
  function hello(seq: bigint, args: Parameters<typeof create<GenMessage<es.HelloRequest>>>[1]) {
    let hr = anyPack(es.HelloRequestSchema, create(es.HelloRequestSchema, args));
    let envelope = create(es.OneOfEnvelopeSchema, {
      message: { case: "request", value: { seq, request: hr } },
    });
    return toBinary(es.OneOfEnvelopeSchema, envelope);
  };
  let hr33 = hello(BigInt(33), { name: "Mark" });

  // just a stub to see how streaming works. no separate length-prefix decoder needed!
  async function esbufStreamParser(stream: ReadableStream<Uint8Array>) {
    let registry = createRegistry(es.file_messages);
    let iter = sizeDelimitedDecodeStream(es.OneOfEnvelopeSchema, stream as any /* TypeScript-DOM-lib-generator#1677 */);
    for await (let { message } of iter) {
      switch (message.case) {
        case "request":
          let r = message.value;
          let sequence = r.seq;
          // either manually switch on the typeUrl ..
          switch (r.request?.typeUrl.slice(r.request.typeUrl.lastIndexOf("/"))) {
            case es.HelloRequestSchema.typeName:
              let hr = anyUnpack(r.request, es.HelloRequestSchema);
              break;
          };
          // or use anyUnpack with a registry and switch with a type guard
          // this is probably safer, since anyUnpack handles typeUrl and isMessage checks for undefined
          let args = anyUnpack(r.request!, registry)
          switch (true) {
            case args === undefined:
              break;
            case isMessage(args, es.HelloRequestSchema):
              // wtf! this actually works as a type guard and args is narrowed down
              console.log(`Request #${sequence} is a HelloRequest{ name: ${args.name} }`);
              break;
          };
          break;
        case "response":
          let { seq, error } = message.value;
          console.log(`Response to request #${seq} received: { err: ${error} }`);
          break;
        default: // none of the above or undefined
          break;
      }; // message.case
    }; // for await (iter)
  };

};