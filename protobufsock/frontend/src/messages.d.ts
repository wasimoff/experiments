import * as $protobuf from "protobufjs";
import Long = require("long");
/** Properties of an Envelope. */
export interface IEnvelope {

    /** Envelope id */
    id?: (number|Long|null);

    /** Envelope type */
    type?: (MessageType|null);

    /** Envelope payload */
    payload?: (google.protobuf.IAny|null);
}

/** Represents an Envelope. */
export class Envelope implements IEnvelope {

    /**
     * Constructs a new Envelope.
     * @param [properties] Properties to set
     */
    constructor(properties?: IEnvelope);

    /** Envelope id. */
    public id: (number|Long);

    /** Envelope type. */
    public type: MessageType;

    /** Envelope payload. */
    public payload?: (google.protobuf.IAny|null);

    /**
     * Creates a new Envelope instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Envelope instance
     */
    public static create(properties?: IEnvelope): Envelope;

    /**
     * Encodes the specified Envelope message. Does not implicitly {@link Envelope.verify|verify} messages.
     * @param message Envelope message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Envelope message, length delimited. Does not implicitly {@link Envelope.verify|verify} messages.
     * @param message Envelope message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Envelope message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Envelope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Envelope;

    /**
     * Decodes an Envelope message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Envelope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Envelope;

    /**
     * Verifies an Envelope message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Envelope message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Envelope
     */
    public static fromObject(object: { [k: string]: any }): Envelope;

    /**
     * Creates a plain object from an Envelope message. Also converts values to other types if specified.
     * @param message Envelope
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Envelope, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Envelope to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Envelope
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** MessageType enum. */
export enum MessageType {
    UNKNOWN = 0,
    Request = 1,
    Reply = 2,
    Note = 3
}

/** Represents a HelloRequest. */
export class HelloRequest implements IHelloRequest {

    /**
     * Constructs a new HelloRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: IHelloRequest);

    /** HelloRequest name. */
    public name: string;

    /**
     * Creates a new HelloRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns HelloRequest instance
     */
    public static create(properties?: IHelloRequest): HelloRequest;

    /**
     * Encodes the specified HelloRequest message. Does not implicitly {@link HelloRequest.verify|verify} messages.
     * @param message HelloRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IHelloRequest, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified HelloRequest message, length delimited. Does not implicitly {@link HelloRequest.verify|verify} messages.
     * @param message HelloRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IHelloRequest, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a HelloRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns HelloRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): HelloRequest;

    /**
     * Decodes a HelloRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns HelloRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): HelloRequest;

    /**
     * Verifies a HelloRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a HelloRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns HelloRequest
     */
    public static fromObject(object: { [k: string]: any }): HelloRequest;

    /**
     * Creates a plain object from a HelloRequest message. Also converts values to other types if specified.
     * @param message HelloRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: HelloRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this HelloRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for HelloRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Represents a HelloReply. */
export class HelloReply implements IHelloReply {

    /**
     * Constructs a new HelloReply.
     * @param [properties] Properties to set
     */
    constructor(properties?: IHelloReply);

    /** HelloReply message. */
    public message: string;

    /**
     * Creates a new HelloReply instance using the specified properties.
     * @param [properties] Properties to set
     * @returns HelloReply instance
     */
    public static create(properties?: IHelloReply): HelloReply;

    /**
     * Encodes the specified HelloReply message. Does not implicitly {@link HelloReply.verify|verify} messages.
     * @param message HelloReply message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IHelloReply, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified HelloReply message, length delimited. Does not implicitly {@link HelloReply.verify|verify} messages.
     * @param message HelloReply message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IHelloReply, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a HelloReply message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns HelloReply
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): HelloReply;

    /**
     * Decodes a HelloReply message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns HelloReply
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): HelloReply;

    /**
     * Verifies a HelloReply message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a HelloReply message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns HelloReply
     */
    public static fromObject(object: { [k: string]: any }): HelloReply;

    /**
     * Creates a plain object from a HelloReply message. Also converts values to other types if specified.
     * @param message HelloReply
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: HelloReply, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this HelloReply to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for HelloReply
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Represents a HelloNote. */
export class HelloNote implements IHelloNote {

    /**
     * Constructs a new HelloNote.
     * @param [properties] Properties to set
     */
    constructor(properties?: IHelloNote);

    /** HelloNote note. */
    public note: string;

    /**
     * Creates a new HelloNote instance using the specified properties.
     * @param [properties] Properties to set
     * @returns HelloNote instance
     */
    public static create(properties?: IHelloNote): HelloNote;

    /**
     * Encodes the specified HelloNote message. Does not implicitly {@link HelloNote.verify|verify} messages.
     * @param message HelloNote message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IHelloNote, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified HelloNote message, length delimited. Does not implicitly {@link HelloNote.verify|verify} messages.
     * @param message HelloNote message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IHelloNote, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a HelloNote message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns HelloNote
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): HelloNote;

    /**
     * Decodes a HelloNote message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns HelloNote
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): HelloNote;

    /**
     * Verifies a HelloNote message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a HelloNote message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns HelloNote
     */
    public static fromObject(object: { [k: string]: any }): HelloNote;

    /**
     * Creates a plain object from a HelloNote message. Also converts values to other types if specified.
     * @param message HelloNote
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: HelloNote, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this HelloNote to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for HelloNote
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Represents a Counter. */
export class Counter implements ICounter {

    /**
     * Constructs a new Counter.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICounter);

    /** Counter seq. */
    public seq: (number|Long);

    /** Counter noise. */
    public noise: Uint8Array;

    /**
     * Creates a new Counter instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Counter instance
     */
    public static create(properties?: ICounter): Counter;

    /**
     * Encodes the specified Counter message. Does not implicitly {@link Counter.verify|verify} messages.
     * @param message Counter message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICounter, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Counter message, length delimited. Does not implicitly {@link Counter.verify|verify} messages.
     * @param message Counter message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICounter, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Counter message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Counter
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Counter;

    /**
     * Decodes a Counter message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Counter
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Counter;

    /**
     * Verifies a Counter message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Counter message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Counter
     */
    public static fromObject(object: { [k: string]: any }): Counter;

    /**
     * Creates a plain object from a Counter message. Also converts values to other types if specified.
     * @param message Counter
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Counter, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Counter to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Counter
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of an Any. */
        interface IAny {

            /** Any type_url */
            type_url?: (string|null);

            /** Any value */
            value?: (Uint8Array|null);
        }

        /** Represents an Any. */
        class Any implements IAny {

            /**
             * Constructs a new Any.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IAny);

            /** Any type_url. */
            public type_url: string;

            /** Any value. */
            public value: Uint8Array;

            /**
             * Creates a new Any instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Any instance
             */
            public static create(properties?: google.protobuf.IAny): google.protobuf.Any;

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Any;

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Any;

            /**
             * Verifies an Any message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Any
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Any;

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @param message Any
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Any, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Any to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Any
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}
