/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const Envelope = $root.Envelope = (() => {

    /**
     * Properties of an Envelope.
     * @exports IEnvelope
     * @interface IEnvelope
     * @property {number|Long|null} [id] Envelope id
     * @property {Envelope.MessageType|null} [type] Envelope type
     * @property {google.protobuf.IAny|null} [payload] Envelope payload
     */

    /**
     * Constructs a new Envelope.
     * @exports Envelope
     * @classdesc Represents an Envelope.
     * @implements IEnvelope
     * @constructor
     * @param {IEnvelope=} [properties] Properties to set
     */
    function Envelope(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Envelope id.
     * @member {number|Long} id
     * @memberof Envelope
     * @instance
     */
    Envelope.prototype.id = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Envelope type.
     * @member {Envelope.MessageType} type
     * @memberof Envelope
     * @instance
     */
    Envelope.prototype.type = 0;

    /**
     * Envelope payload.
     * @member {google.protobuf.IAny|null|undefined} payload
     * @memberof Envelope
     * @instance
     */
    Envelope.prototype.payload = null;

    /**
     * Creates a new Envelope instance using the specified properties.
     * @function create
     * @memberof Envelope
     * @static
     * @param {IEnvelope=} [properties] Properties to set
     * @returns {Envelope} Envelope instance
     */
    Envelope.create = function create(properties) {
        return new Envelope(properties);
    };

    /**
     * Encodes the specified Envelope message. Does not implicitly {@link Envelope.verify|verify} messages.
     * @function encode
     * @memberof Envelope
     * @static
     * @param {IEnvelope} message Envelope message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Envelope.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.id);
        if (message.type != null && Object.hasOwnProperty.call(message, "type"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.type);
        if (message.payload != null && Object.hasOwnProperty.call(message, "payload"))
            $root.google.protobuf.Any.encode(message.payload, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Envelope message, length delimited. Does not implicitly {@link Envelope.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Envelope
     * @static
     * @param {IEnvelope} message Envelope message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Envelope.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Envelope message from the specified reader or buffer.
     * @function decode
     * @memberof Envelope
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Envelope} Envelope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Envelope.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Envelope();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.id = reader.uint64();
                    break;
                }
            case 2: {
                    message.type = reader.int32();
                    break;
                }
            case 3: {
                    message.payload = $root.google.protobuf.Any.decode(reader, reader.uint32());
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Envelope message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Envelope
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Envelope} Envelope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Envelope.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Envelope message.
     * @function verify
     * @memberof Envelope
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Envelope.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                return "id: integer|Long expected";
        if (message.type != null && message.hasOwnProperty("type"))
            switch (message.type) {
            default:
                return "type: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
                break;
            }
        if (message.payload != null && message.hasOwnProperty("payload")) {
            let error = $root.google.protobuf.Any.verify(message.payload);
            if (error)
                return "payload." + error;
        }
        return null;
    };

    /**
     * Creates an Envelope message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Envelope
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Envelope} Envelope
     */
    Envelope.fromObject = function fromObject(object) {
        if (object instanceof $root.Envelope)
            return object;
        let message = new $root.Envelope();
        if (object.id != null)
            if ($util.Long)
                (message.id = $util.Long.fromValue(object.id)).unsigned = true;
            else if (typeof object.id === "string")
                message.id = parseInt(object.id, 10);
            else if (typeof object.id === "number")
                message.id = object.id;
            else if (typeof object.id === "object")
                message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber(true);
        switch (object.type) {
        default:
            if (typeof object.type === "number") {
                message.type = object.type;
                break;
            }
            break;
        case "UNKNOWN":
        case 0:
            message.type = 0;
            break;
        case "Req":
        case 1:
            message.type = 1;
            break;
        case "Res":
        case 2:
            message.type = 2;
            break;
        case "Ev":
        case 3:
            message.type = 3;
            break;
        }
        if (object.payload != null) {
            if (typeof object.payload !== "object")
                throw TypeError(".Envelope.payload: object expected");
            message.payload = $root.google.protobuf.Any.fromObject(object.payload);
        }
        return message;
    };

    /**
     * Creates a plain object from an Envelope message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Envelope
     * @static
     * @param {Envelope} message Envelope
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Envelope.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            if ($util.Long) {
                let long = new $util.Long(0, 0, true);
                object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.id = options.longs === String ? "0" : 0;
            object.type = options.enums === String ? "UNKNOWN" : 0;
            object.payload = null;
        }
        if (message.id != null && message.hasOwnProperty("id"))
            if (typeof message.id === "number")
                object.id = options.longs === String ? String(message.id) : message.id;
            else
                object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber(true) : message.id;
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = options.enums === String ? $root.Envelope.MessageType[message.type] === undefined ? message.type : $root.Envelope.MessageType[message.type] : message.type;
        if (message.payload != null && message.hasOwnProperty("payload"))
            object.payload = $root.google.protobuf.Any.toObject(message.payload, options);
        return object;
    };

    /**
     * Converts this Envelope to JSON.
     * @function toJSON
     * @memberof Envelope
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Envelope.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Envelope
     * @function getTypeUrl
     * @memberof Envelope
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Envelope.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Envelope";
    };

    /**
     * MessageType enum.
     * @name Envelope.MessageType
     * @enum {number}
     * @property {number} UNKNOWN=0 UNKNOWN value
     * @property {number} Req=1 Req value
     * @property {number} Res=2 Res value
     * @property {number} Ev=3 Ev value
     */
    Envelope.MessageType = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UNKNOWN"] = 0;
        values[valuesById[1] = "Req"] = 1;
        values[valuesById[2] = "Res"] = 2;
        values[valuesById[3] = "Ev"] = 3;
        return values;
    })();

    return Envelope;
})();

export const HelloRequest = $root.HelloRequest = (() => {

    /**
     * Properties of a HelloRequest.
     * @exports IHelloRequest
     * @interface IHelloRequest
     * @property {string|null} [name] HelloRequest name
     */

    /**
     * Constructs a new HelloRequest.
     * @exports HelloRequest
     * @classdesc Represents a HelloRequest.
     * @implements IHelloRequest
     * @constructor
     * @param {IHelloRequest=} [properties] Properties to set
     */
    function HelloRequest(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * HelloRequest name.
     * @member {string} name
     * @memberof HelloRequest
     * @instance
     */
    HelloRequest.prototype.name = "";

    /**
     * Creates a new HelloRequest instance using the specified properties.
     * @function create
     * @memberof HelloRequest
     * @static
     * @param {IHelloRequest=} [properties] Properties to set
     * @returns {HelloRequest} HelloRequest instance
     */
    HelloRequest.create = function create(properties) {
        return new HelloRequest(properties);
    };

    /**
     * Encodes the specified HelloRequest message. Does not implicitly {@link HelloRequest.verify|verify} messages.
     * @function encode
     * @memberof HelloRequest
     * @static
     * @param {IHelloRequest} message HelloRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    HelloRequest.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
        return writer;
    };

    /**
     * Encodes the specified HelloRequest message, length delimited. Does not implicitly {@link HelloRequest.verify|verify} messages.
     * @function encodeDelimited
     * @memberof HelloRequest
     * @static
     * @param {IHelloRequest} message HelloRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    HelloRequest.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a HelloRequest message from the specified reader or buffer.
     * @function decode
     * @memberof HelloRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {HelloRequest} HelloRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    HelloRequest.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.HelloRequest();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.name = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a HelloRequest message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof HelloRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {HelloRequest} HelloRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    HelloRequest.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a HelloRequest message.
     * @function verify
     * @memberof HelloRequest
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    HelloRequest.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        return null;
    };

    /**
     * Creates a HelloRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof HelloRequest
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {HelloRequest} HelloRequest
     */
    HelloRequest.fromObject = function fromObject(object) {
        if (object instanceof $root.HelloRequest)
            return object;
        let message = new $root.HelloRequest();
        if (object.name != null)
            message.name = String(object.name);
        return message;
    };

    /**
     * Creates a plain object from a HelloRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof HelloRequest
     * @static
     * @param {HelloRequest} message HelloRequest
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    HelloRequest.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.name = "";
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        return object;
    };

    /**
     * Converts this HelloRequest to JSON.
     * @function toJSON
     * @memberof HelloRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    HelloRequest.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for HelloRequest
     * @function getTypeUrl
     * @memberof HelloRequest
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    HelloRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/HelloRequest";
    };

    return HelloRequest;
})();

export const HelloReply = $root.HelloReply = (() => {

    /**
     * Properties of a HelloReply.
     * @exports IHelloReply
     * @interface IHelloReply
     * @property {string|null} [message] HelloReply message
     */

    /**
     * Constructs a new HelloReply.
     * @exports HelloReply
     * @classdesc Represents a HelloReply.
     * @implements IHelloReply
     * @constructor
     * @param {IHelloReply=} [properties] Properties to set
     */
    function HelloReply(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * HelloReply message.
     * @member {string} message
     * @memberof HelloReply
     * @instance
     */
    HelloReply.prototype.message = "";

    /**
     * Creates a new HelloReply instance using the specified properties.
     * @function create
     * @memberof HelloReply
     * @static
     * @param {IHelloReply=} [properties] Properties to set
     * @returns {HelloReply} HelloReply instance
     */
    HelloReply.create = function create(properties) {
        return new HelloReply(properties);
    };

    /**
     * Encodes the specified HelloReply message. Does not implicitly {@link HelloReply.verify|verify} messages.
     * @function encode
     * @memberof HelloReply
     * @static
     * @param {IHelloReply} message HelloReply message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    HelloReply.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.message != null && Object.hasOwnProperty.call(message, "message"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.message);
        return writer;
    };

    /**
     * Encodes the specified HelloReply message, length delimited. Does not implicitly {@link HelloReply.verify|verify} messages.
     * @function encodeDelimited
     * @memberof HelloReply
     * @static
     * @param {IHelloReply} message HelloReply message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    HelloReply.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a HelloReply message from the specified reader or buffer.
     * @function decode
     * @memberof HelloReply
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {HelloReply} HelloReply
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    HelloReply.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.HelloReply();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.message = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a HelloReply message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof HelloReply
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {HelloReply} HelloReply
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    HelloReply.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a HelloReply message.
     * @function verify
     * @memberof HelloReply
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    HelloReply.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.message != null && message.hasOwnProperty("message"))
            if (!$util.isString(message.message))
                return "message: string expected";
        return null;
    };

    /**
     * Creates a HelloReply message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof HelloReply
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {HelloReply} HelloReply
     */
    HelloReply.fromObject = function fromObject(object) {
        if (object instanceof $root.HelloReply)
            return object;
        let message = new $root.HelloReply();
        if (object.message != null)
            message.message = String(object.message);
        return message;
    };

    /**
     * Creates a plain object from a HelloReply message. Also converts values to other types if specified.
     * @function toObject
     * @memberof HelloReply
     * @static
     * @param {HelloReply} message HelloReply
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    HelloReply.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.message = "";
        if (message.message != null && message.hasOwnProperty("message"))
            object.message = message.message;
        return object;
    };

    /**
     * Converts this HelloReply to JSON.
     * @function toJSON
     * @memberof HelloReply
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    HelloReply.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for HelloReply
     * @function getTypeUrl
     * @memberof HelloReply
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    HelloReply.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/HelloReply";
    };

    return HelloReply;
})();

export const HelloNote = $root.HelloNote = (() => {

    /**
     * Properties of a HelloNote.
     * @exports IHelloNote
     * @interface IHelloNote
     * @property {string|null} [note] HelloNote note
     */

    /**
     * Constructs a new HelloNote.
     * @exports HelloNote
     * @classdesc Represents a HelloNote.
     * @implements IHelloNote
     * @constructor
     * @param {IHelloNote=} [properties] Properties to set
     */
    function HelloNote(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * HelloNote note.
     * @member {string} note
     * @memberof HelloNote
     * @instance
     */
    HelloNote.prototype.note = "";

    /**
     * Creates a new HelloNote instance using the specified properties.
     * @function create
     * @memberof HelloNote
     * @static
     * @param {IHelloNote=} [properties] Properties to set
     * @returns {HelloNote} HelloNote instance
     */
    HelloNote.create = function create(properties) {
        return new HelloNote(properties);
    };

    /**
     * Encodes the specified HelloNote message. Does not implicitly {@link HelloNote.verify|verify} messages.
     * @function encode
     * @memberof HelloNote
     * @static
     * @param {IHelloNote} message HelloNote message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    HelloNote.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.note != null && Object.hasOwnProperty.call(message, "note"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.note);
        return writer;
    };

    /**
     * Encodes the specified HelloNote message, length delimited. Does not implicitly {@link HelloNote.verify|verify} messages.
     * @function encodeDelimited
     * @memberof HelloNote
     * @static
     * @param {IHelloNote} message HelloNote message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    HelloNote.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a HelloNote message from the specified reader or buffer.
     * @function decode
     * @memberof HelloNote
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {HelloNote} HelloNote
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    HelloNote.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.HelloNote();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.note = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a HelloNote message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof HelloNote
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {HelloNote} HelloNote
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    HelloNote.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a HelloNote message.
     * @function verify
     * @memberof HelloNote
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    HelloNote.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.note != null && message.hasOwnProperty("note"))
            if (!$util.isString(message.note))
                return "note: string expected";
        return null;
    };

    /**
     * Creates a HelloNote message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof HelloNote
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {HelloNote} HelloNote
     */
    HelloNote.fromObject = function fromObject(object) {
        if (object instanceof $root.HelloNote)
            return object;
        let message = new $root.HelloNote();
        if (object.note != null)
            message.note = String(object.note);
        return message;
    };

    /**
     * Creates a plain object from a HelloNote message. Also converts values to other types if specified.
     * @function toObject
     * @memberof HelloNote
     * @static
     * @param {HelloNote} message HelloNote
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    HelloNote.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.note = "";
        if (message.note != null && message.hasOwnProperty("note"))
            object.note = message.note;
        return object;
    };

    /**
     * Converts this HelloNote to JSON.
     * @function toJSON
     * @memberof HelloNote
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    HelloNote.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for HelloNote
     * @function getTypeUrl
     * @memberof HelloNote
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    HelloNote.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/HelloNote";
    };

    return HelloNote;
})();

export const Counter = $root.Counter = (() => {

    /**
     * Properties of a Counter.
     * @exports ICounter
     * @interface ICounter
     * @property {number|Long|null} [seq] Counter seq
     * @property {Uint8Array|null} [noise] Counter noise
     */

    /**
     * Constructs a new Counter.
     * @exports Counter
     * @classdesc Represents a Counter.
     * @implements ICounter
     * @constructor
     * @param {ICounter=} [properties] Properties to set
     */
    function Counter(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Counter seq.
     * @member {number|Long} seq
     * @memberof Counter
     * @instance
     */
    Counter.prototype.seq = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Counter noise.
     * @member {Uint8Array} noise
     * @memberof Counter
     * @instance
     */
    Counter.prototype.noise = $util.newBuffer([]);

    /**
     * Creates a new Counter instance using the specified properties.
     * @function create
     * @memberof Counter
     * @static
     * @param {ICounter=} [properties] Properties to set
     * @returns {Counter} Counter instance
     */
    Counter.create = function create(properties) {
        return new Counter(properties);
    };

    /**
     * Encodes the specified Counter message. Does not implicitly {@link Counter.verify|verify} messages.
     * @function encode
     * @memberof Counter
     * @static
     * @param {ICounter} message Counter message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Counter.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.seq != null && Object.hasOwnProperty.call(message, "seq"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.seq);
        if (message.noise != null && Object.hasOwnProperty.call(message, "noise"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.noise);
        return writer;
    };

    /**
     * Encodes the specified Counter message, length delimited. Does not implicitly {@link Counter.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Counter
     * @static
     * @param {ICounter} message Counter message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Counter.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Counter message from the specified reader or buffer.
     * @function decode
     * @memberof Counter
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Counter} Counter
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Counter.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Counter();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.seq = reader.uint64();
                    break;
                }
            case 2: {
                    message.noise = reader.bytes();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Counter message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Counter
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Counter} Counter
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Counter.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Counter message.
     * @function verify
     * @memberof Counter
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Counter.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.seq != null && message.hasOwnProperty("seq"))
            if (!$util.isInteger(message.seq) && !(message.seq && $util.isInteger(message.seq.low) && $util.isInteger(message.seq.high)))
                return "seq: integer|Long expected";
        if (message.noise != null && message.hasOwnProperty("noise"))
            if (!(message.noise && typeof message.noise.length === "number" || $util.isString(message.noise)))
                return "noise: buffer expected";
        return null;
    };

    /**
     * Creates a Counter message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Counter
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Counter} Counter
     */
    Counter.fromObject = function fromObject(object) {
        if (object instanceof $root.Counter)
            return object;
        let message = new $root.Counter();
        if (object.seq != null)
            if ($util.Long)
                (message.seq = $util.Long.fromValue(object.seq)).unsigned = true;
            else if (typeof object.seq === "string")
                message.seq = parseInt(object.seq, 10);
            else if (typeof object.seq === "number")
                message.seq = object.seq;
            else if (typeof object.seq === "object")
                message.seq = new $util.LongBits(object.seq.low >>> 0, object.seq.high >>> 0).toNumber(true);
        if (object.noise != null)
            if (typeof object.noise === "string")
                $util.base64.decode(object.noise, message.noise = $util.newBuffer($util.base64.length(object.noise)), 0);
            else if (object.noise.length >= 0)
                message.noise = object.noise;
        return message;
    };

    /**
     * Creates a plain object from a Counter message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Counter
     * @static
     * @param {Counter} message Counter
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Counter.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            if ($util.Long) {
                let long = new $util.Long(0, 0, true);
                object.seq = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.seq = options.longs === String ? "0" : 0;
            if (options.bytes === String)
                object.noise = "";
            else {
                object.noise = [];
                if (options.bytes !== Array)
                    object.noise = $util.newBuffer(object.noise);
            }
        }
        if (message.seq != null && message.hasOwnProperty("seq"))
            if (typeof message.seq === "number")
                object.seq = options.longs === String ? String(message.seq) : message.seq;
            else
                object.seq = options.longs === String ? $util.Long.prototype.toString.call(message.seq) : options.longs === Number ? new $util.LongBits(message.seq.low >>> 0, message.seq.high >>> 0).toNumber(true) : message.seq;
        if (message.noise != null && message.hasOwnProperty("noise"))
            object.noise = options.bytes === String ? $util.base64.encode(message.noise, 0, message.noise.length) : options.bytes === Array ? Array.prototype.slice.call(message.noise) : message.noise;
        return object;
    };

    /**
     * Converts this Counter to JSON.
     * @function toJSON
     * @memberof Counter
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Counter.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Counter
     * @function getTypeUrl
     * @memberof Counter
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Counter.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Counter";
    };

    return Counter;
})();

export const OneOfEnvelope = $root.OneOfEnvelope = (() => {

    /**
     * Properties of an OneOfEnvelope.
     * @exports IOneOfEnvelope
     * @interface IOneOfEnvelope
     * @property {IRequest|null} [request] OneOfEnvelope request
     * @property {IResponse|null} [response] OneOfEnvelope response
     * @property {IEvent|null} [event] OneOfEnvelope event
     */

    /**
     * Constructs a new OneOfEnvelope.
     * @exports OneOfEnvelope
     * @classdesc Represents an OneOfEnvelope.
     * @implements IOneOfEnvelope
     * @constructor
     * @param {IOneOfEnvelope=} [properties] Properties to set
     */
    function OneOfEnvelope(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * OneOfEnvelope request.
     * @member {IRequest|null|undefined} request
     * @memberof OneOfEnvelope
     * @instance
     */
    OneOfEnvelope.prototype.request = null;

    /**
     * OneOfEnvelope response.
     * @member {IResponse|null|undefined} response
     * @memberof OneOfEnvelope
     * @instance
     */
    OneOfEnvelope.prototype.response = null;

    /**
     * OneOfEnvelope event.
     * @member {IEvent|null|undefined} event
     * @memberof OneOfEnvelope
     * @instance
     */
    OneOfEnvelope.prototype.event = null;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    /**
     * OneOfEnvelope message.
     * @member {"request"|"response"|"event"|undefined} message
     * @memberof OneOfEnvelope
     * @instance
     */
    Object.defineProperty(OneOfEnvelope.prototype, "message", {
        get: $util.oneOfGetter($oneOfFields = ["request", "response", "event"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new OneOfEnvelope instance using the specified properties.
     * @function create
     * @memberof OneOfEnvelope
     * @static
     * @param {IOneOfEnvelope=} [properties] Properties to set
     * @returns {OneOfEnvelope} OneOfEnvelope instance
     */
    OneOfEnvelope.create = function create(properties) {
        return new OneOfEnvelope(properties);
    };

    /**
     * Encodes the specified OneOfEnvelope message. Does not implicitly {@link OneOfEnvelope.verify|verify} messages.
     * @function encode
     * @memberof OneOfEnvelope
     * @static
     * @param {IOneOfEnvelope} message OneOfEnvelope message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    OneOfEnvelope.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.request != null && Object.hasOwnProperty.call(message, "request"))
            $root.Request.encode(message.request, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.response != null && Object.hasOwnProperty.call(message, "response"))
            $root.Response.encode(message.response, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.event != null && Object.hasOwnProperty.call(message, "event"))
            $root.Event.encode(message.event, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified OneOfEnvelope message, length delimited. Does not implicitly {@link OneOfEnvelope.verify|verify} messages.
     * @function encodeDelimited
     * @memberof OneOfEnvelope
     * @static
     * @param {IOneOfEnvelope} message OneOfEnvelope message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    OneOfEnvelope.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an OneOfEnvelope message from the specified reader or buffer.
     * @function decode
     * @memberof OneOfEnvelope
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {OneOfEnvelope} OneOfEnvelope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    OneOfEnvelope.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.OneOfEnvelope();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.request = $root.Request.decode(reader, reader.uint32());
                    break;
                }
            case 2: {
                    message.response = $root.Response.decode(reader, reader.uint32());
                    break;
                }
            case 3: {
                    message.event = $root.Event.decode(reader, reader.uint32());
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an OneOfEnvelope message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof OneOfEnvelope
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {OneOfEnvelope} OneOfEnvelope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    OneOfEnvelope.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an OneOfEnvelope message.
     * @function verify
     * @memberof OneOfEnvelope
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    OneOfEnvelope.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        let properties = {};
        if (message.request != null && message.hasOwnProperty("request")) {
            properties.message = 1;
            {
                let error = $root.Request.verify(message.request);
                if (error)
                    return "request." + error;
            }
        }
        if (message.response != null && message.hasOwnProperty("response")) {
            if (properties.message === 1)
                return "message: multiple values";
            properties.message = 1;
            {
                let error = $root.Response.verify(message.response);
                if (error)
                    return "response." + error;
            }
        }
        if (message.event != null && message.hasOwnProperty("event")) {
            if (properties.message === 1)
                return "message: multiple values";
            properties.message = 1;
            {
                let error = $root.Event.verify(message.event);
                if (error)
                    return "event." + error;
            }
        }
        return null;
    };

    /**
     * Creates an OneOfEnvelope message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof OneOfEnvelope
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {OneOfEnvelope} OneOfEnvelope
     */
    OneOfEnvelope.fromObject = function fromObject(object) {
        if (object instanceof $root.OneOfEnvelope)
            return object;
        let message = new $root.OneOfEnvelope();
        if (object.request != null) {
            if (typeof object.request !== "object")
                throw TypeError(".OneOfEnvelope.request: object expected");
            message.request = $root.Request.fromObject(object.request);
        }
        if (object.response != null) {
            if (typeof object.response !== "object")
                throw TypeError(".OneOfEnvelope.response: object expected");
            message.response = $root.Response.fromObject(object.response);
        }
        if (object.event != null) {
            if (typeof object.event !== "object")
                throw TypeError(".OneOfEnvelope.event: object expected");
            message.event = $root.Event.fromObject(object.event);
        }
        return message;
    };

    /**
     * Creates a plain object from an OneOfEnvelope message. Also converts values to other types if specified.
     * @function toObject
     * @memberof OneOfEnvelope
     * @static
     * @param {OneOfEnvelope} message OneOfEnvelope
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    OneOfEnvelope.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (message.request != null && message.hasOwnProperty("request")) {
            object.request = $root.Request.toObject(message.request, options);
            if (options.oneofs)
                object.message = "request";
        }
        if (message.response != null && message.hasOwnProperty("response")) {
            object.response = $root.Response.toObject(message.response, options);
            if (options.oneofs)
                object.message = "response";
        }
        if (message.event != null && message.hasOwnProperty("event")) {
            object.event = $root.Event.toObject(message.event, options);
            if (options.oneofs)
                object.message = "event";
        }
        return object;
    };

    /**
     * Converts this OneOfEnvelope to JSON.
     * @function toJSON
     * @memberof OneOfEnvelope
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    OneOfEnvelope.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for OneOfEnvelope
     * @function getTypeUrl
     * @memberof OneOfEnvelope
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    OneOfEnvelope.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/OneOfEnvelope";
    };

    return OneOfEnvelope;
})();

export const AnyEnvelope = $root.AnyEnvelope = (() => {

    /**
     * Properties of an AnyEnvelope.
     * @exports IAnyEnvelope
     * @interface IAnyEnvelope
     * @property {AnyEnvelope.MessageType|null} [type] AnyEnvelope type
     * @property {google.protobuf.IAny|null} [payload] AnyEnvelope payload
     */

    /**
     * Constructs a new AnyEnvelope.
     * @exports AnyEnvelope
     * @classdesc Represents an AnyEnvelope.
     * @implements IAnyEnvelope
     * @constructor
     * @param {IAnyEnvelope=} [properties] Properties to set
     */
    function AnyEnvelope(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AnyEnvelope type.
     * @member {AnyEnvelope.MessageType} type
     * @memberof AnyEnvelope
     * @instance
     */
    AnyEnvelope.prototype.type = 0;

    /**
     * AnyEnvelope payload.
     * @member {google.protobuf.IAny|null|undefined} payload
     * @memberof AnyEnvelope
     * @instance
     */
    AnyEnvelope.prototype.payload = null;

    /**
     * Creates a new AnyEnvelope instance using the specified properties.
     * @function create
     * @memberof AnyEnvelope
     * @static
     * @param {IAnyEnvelope=} [properties] Properties to set
     * @returns {AnyEnvelope} AnyEnvelope instance
     */
    AnyEnvelope.create = function create(properties) {
        return new AnyEnvelope(properties);
    };

    /**
     * Encodes the specified AnyEnvelope message. Does not implicitly {@link AnyEnvelope.verify|verify} messages.
     * @function encode
     * @memberof AnyEnvelope
     * @static
     * @param {IAnyEnvelope} message AnyEnvelope message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AnyEnvelope.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.type != null && Object.hasOwnProperty.call(message, "type"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.type);
        if (message.payload != null && Object.hasOwnProperty.call(message, "payload"))
            $root.google.protobuf.Any.encode(message.payload, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified AnyEnvelope message, length delimited. Does not implicitly {@link AnyEnvelope.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AnyEnvelope
     * @static
     * @param {IAnyEnvelope} message AnyEnvelope message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AnyEnvelope.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AnyEnvelope message from the specified reader or buffer.
     * @function decode
     * @memberof AnyEnvelope
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AnyEnvelope} AnyEnvelope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AnyEnvelope.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.AnyEnvelope();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 2: {
                    message.type = reader.int32();
                    break;
                }
            case 3: {
                    message.payload = $root.google.protobuf.Any.decode(reader, reader.uint32());
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an AnyEnvelope message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AnyEnvelope
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AnyEnvelope} AnyEnvelope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AnyEnvelope.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AnyEnvelope message.
     * @function verify
     * @memberof AnyEnvelope
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AnyEnvelope.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.type != null && message.hasOwnProperty("type"))
            switch (message.type) {
            default:
                return "type: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
                break;
            }
        if (message.payload != null && message.hasOwnProperty("payload")) {
            let error = $root.google.protobuf.Any.verify(message.payload);
            if (error)
                return "payload." + error;
        }
        return null;
    };

    /**
     * Creates an AnyEnvelope message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AnyEnvelope
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AnyEnvelope} AnyEnvelope
     */
    AnyEnvelope.fromObject = function fromObject(object) {
        if (object instanceof $root.AnyEnvelope)
            return object;
        let message = new $root.AnyEnvelope();
        switch (object.type) {
        default:
            if (typeof object.type === "number") {
                message.type = object.type;
                break;
            }
            break;
        case "UNKNOWN":
        case 0:
            message.type = 0;
            break;
        case "Req":
        case 1:
            message.type = 1;
            break;
        case "Res":
        case 2:
            message.type = 2;
            break;
        case "Ev":
        case 3:
            message.type = 3;
            break;
        }
        if (object.payload != null) {
            if (typeof object.payload !== "object")
                throw TypeError(".AnyEnvelope.payload: object expected");
            message.payload = $root.google.protobuf.Any.fromObject(object.payload);
        }
        return message;
    };

    /**
     * Creates a plain object from an AnyEnvelope message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AnyEnvelope
     * @static
     * @param {AnyEnvelope} message AnyEnvelope
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AnyEnvelope.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.type = options.enums === String ? "UNKNOWN" : 0;
            object.payload = null;
        }
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = options.enums === String ? $root.AnyEnvelope.MessageType[message.type] === undefined ? message.type : $root.AnyEnvelope.MessageType[message.type] : message.type;
        if (message.payload != null && message.hasOwnProperty("payload"))
            object.payload = $root.google.protobuf.Any.toObject(message.payload, options);
        return object;
    };

    /**
     * Converts this AnyEnvelope to JSON.
     * @function toJSON
     * @memberof AnyEnvelope
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AnyEnvelope.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for AnyEnvelope
     * @function getTypeUrl
     * @memberof AnyEnvelope
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    AnyEnvelope.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/AnyEnvelope";
    };

    /**
     * MessageType enum.
     * @name AnyEnvelope.MessageType
     * @enum {number}
     * @property {number} UNKNOWN=0 UNKNOWN value
     * @property {number} Req=1 Req value
     * @property {number} Res=2 Res value
     * @property {number} Ev=3 Ev value
     */
    AnyEnvelope.MessageType = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UNKNOWN"] = 0;
        values[valuesById[1] = "Req"] = 1;
        values[valuesById[2] = "Res"] = 2;
        values[valuesById[3] = "Ev"] = 3;
        return values;
    })();

    return AnyEnvelope;
})();

export const Request = $root.Request = (() => {

    /**
     * Properties of a Request.
     * @exports IRequest
     * @interface IRequest
     * @property {number|Long|null} [seq] Request seq
     * @property {google.protobuf.IAny|null} [request] Request request
     */

    /**
     * Constructs a new Request.
     * @exports Request
     * @classdesc Represents a Request.
     * @implements IRequest
     * @constructor
     * @param {IRequest=} [properties] Properties to set
     */
    function Request(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Request seq.
     * @member {number|Long} seq
     * @memberof Request
     * @instance
     */
    Request.prototype.seq = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Request request.
     * @member {google.protobuf.IAny|null|undefined} request
     * @memberof Request
     * @instance
     */
    Request.prototype.request = null;

    /**
     * Creates a new Request instance using the specified properties.
     * @function create
     * @memberof Request
     * @static
     * @param {IRequest=} [properties] Properties to set
     * @returns {Request} Request instance
     */
    Request.create = function create(properties) {
        return new Request(properties);
    };

    /**
     * Encodes the specified Request message. Does not implicitly {@link Request.verify|verify} messages.
     * @function encode
     * @memberof Request
     * @static
     * @param {IRequest} message Request message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Request.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.seq != null && Object.hasOwnProperty.call(message, "seq"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.seq);
        if (message.request != null && Object.hasOwnProperty.call(message, "request"))
            $root.google.protobuf.Any.encode(message.request, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Request message, length delimited. Does not implicitly {@link Request.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Request
     * @static
     * @param {IRequest} message Request message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Request.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Request message from the specified reader or buffer.
     * @function decode
     * @memberof Request
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Request} Request
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Request.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Request();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.seq = reader.uint64();
                    break;
                }
            case 2: {
                    message.request = $root.google.protobuf.Any.decode(reader, reader.uint32());
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Request message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Request
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Request} Request
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Request.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Request message.
     * @function verify
     * @memberof Request
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Request.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.seq != null && message.hasOwnProperty("seq"))
            if (!$util.isInteger(message.seq) && !(message.seq && $util.isInteger(message.seq.low) && $util.isInteger(message.seq.high)))
                return "seq: integer|Long expected";
        if (message.request != null && message.hasOwnProperty("request")) {
            let error = $root.google.protobuf.Any.verify(message.request);
            if (error)
                return "request." + error;
        }
        return null;
    };

    /**
     * Creates a Request message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Request
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Request} Request
     */
    Request.fromObject = function fromObject(object) {
        if (object instanceof $root.Request)
            return object;
        let message = new $root.Request();
        if (object.seq != null)
            if ($util.Long)
                (message.seq = $util.Long.fromValue(object.seq)).unsigned = true;
            else if (typeof object.seq === "string")
                message.seq = parseInt(object.seq, 10);
            else if (typeof object.seq === "number")
                message.seq = object.seq;
            else if (typeof object.seq === "object")
                message.seq = new $util.LongBits(object.seq.low >>> 0, object.seq.high >>> 0).toNumber(true);
        if (object.request != null) {
            if (typeof object.request !== "object")
                throw TypeError(".Request.request: object expected");
            message.request = $root.google.protobuf.Any.fromObject(object.request);
        }
        return message;
    };

    /**
     * Creates a plain object from a Request message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Request
     * @static
     * @param {Request} message Request
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Request.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            if ($util.Long) {
                let long = new $util.Long(0, 0, true);
                object.seq = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.seq = options.longs === String ? "0" : 0;
            object.request = null;
        }
        if (message.seq != null && message.hasOwnProperty("seq"))
            if (typeof message.seq === "number")
                object.seq = options.longs === String ? String(message.seq) : message.seq;
            else
                object.seq = options.longs === String ? $util.Long.prototype.toString.call(message.seq) : options.longs === Number ? new $util.LongBits(message.seq.low >>> 0, message.seq.high >>> 0).toNumber(true) : message.seq;
        if (message.request != null && message.hasOwnProperty("request"))
            object.request = $root.google.protobuf.Any.toObject(message.request, options);
        return object;
    };

    /**
     * Converts this Request to JSON.
     * @function toJSON
     * @memberof Request
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Request.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Request
     * @function getTypeUrl
     * @memberof Request
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Request.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Request";
    };

    return Request;
})();

export const Response = $root.Response = (() => {

    /**
     * Properties of a Response.
     * @exports IResponse
     * @interface IResponse
     * @property {number|Long|null} [seq] Response seq
     * @property {string|null} [error] Response error
     * @property {google.protobuf.IAny|null} [response] Response response
     */

    /**
     * Constructs a new Response.
     * @exports Response
     * @classdesc Represents a Response.
     * @implements IResponse
     * @constructor
     * @param {IResponse=} [properties] Properties to set
     */
    function Response(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Response seq.
     * @member {number|Long} seq
     * @memberof Response
     * @instance
     */
    Response.prototype.seq = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Response error.
     * @member {string} error
     * @memberof Response
     * @instance
     */
    Response.prototype.error = "";

    /**
     * Response response.
     * @member {google.protobuf.IAny|null|undefined} response
     * @memberof Response
     * @instance
     */
    Response.prototype.response = null;

    /**
     * Creates a new Response instance using the specified properties.
     * @function create
     * @memberof Response
     * @static
     * @param {IResponse=} [properties] Properties to set
     * @returns {Response} Response instance
     */
    Response.create = function create(properties) {
        return new Response(properties);
    };

    /**
     * Encodes the specified Response message. Does not implicitly {@link Response.verify|verify} messages.
     * @function encode
     * @memberof Response
     * @static
     * @param {IResponse} message Response message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Response.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.seq != null && Object.hasOwnProperty.call(message, "seq"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.seq);
        if (message.error != null && Object.hasOwnProperty.call(message, "error"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.error);
        if (message.response != null && Object.hasOwnProperty.call(message, "response"))
            $root.google.protobuf.Any.encode(message.response, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Response message, length delimited. Does not implicitly {@link Response.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Response
     * @static
     * @param {IResponse} message Response message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Response.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Response message from the specified reader or buffer.
     * @function decode
     * @memberof Response
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Response} Response
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Response.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Response();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.seq = reader.uint64();
                    break;
                }
            case 2: {
                    message.error = reader.string();
                    break;
                }
            case 3: {
                    message.response = $root.google.protobuf.Any.decode(reader, reader.uint32());
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Response message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Response
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Response} Response
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Response.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Response message.
     * @function verify
     * @memberof Response
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Response.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.seq != null && message.hasOwnProperty("seq"))
            if (!$util.isInteger(message.seq) && !(message.seq && $util.isInteger(message.seq.low) && $util.isInteger(message.seq.high)))
                return "seq: integer|Long expected";
        if (message.error != null && message.hasOwnProperty("error"))
            if (!$util.isString(message.error))
                return "error: string expected";
        if (message.response != null && message.hasOwnProperty("response")) {
            let error = $root.google.protobuf.Any.verify(message.response);
            if (error)
                return "response." + error;
        }
        return null;
    };

    /**
     * Creates a Response message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Response
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Response} Response
     */
    Response.fromObject = function fromObject(object) {
        if (object instanceof $root.Response)
            return object;
        let message = new $root.Response();
        if (object.seq != null)
            if ($util.Long)
                (message.seq = $util.Long.fromValue(object.seq)).unsigned = true;
            else if (typeof object.seq === "string")
                message.seq = parseInt(object.seq, 10);
            else if (typeof object.seq === "number")
                message.seq = object.seq;
            else if (typeof object.seq === "object")
                message.seq = new $util.LongBits(object.seq.low >>> 0, object.seq.high >>> 0).toNumber(true);
        if (object.error != null)
            message.error = String(object.error);
        if (object.response != null) {
            if (typeof object.response !== "object")
                throw TypeError(".Response.response: object expected");
            message.response = $root.google.protobuf.Any.fromObject(object.response);
        }
        return message;
    };

    /**
     * Creates a plain object from a Response message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Response
     * @static
     * @param {Response} message Response
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Response.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            if ($util.Long) {
                let long = new $util.Long(0, 0, true);
                object.seq = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.seq = options.longs === String ? "0" : 0;
            object.error = "";
            object.response = null;
        }
        if (message.seq != null && message.hasOwnProperty("seq"))
            if (typeof message.seq === "number")
                object.seq = options.longs === String ? String(message.seq) : message.seq;
            else
                object.seq = options.longs === String ? $util.Long.prototype.toString.call(message.seq) : options.longs === Number ? new $util.LongBits(message.seq.low >>> 0, message.seq.high >>> 0).toNumber(true) : message.seq;
        if (message.error != null && message.hasOwnProperty("error"))
            object.error = message.error;
        if (message.response != null && message.hasOwnProperty("response"))
            object.response = $root.google.protobuf.Any.toObject(message.response, options);
        return object;
    };

    /**
     * Converts this Response to JSON.
     * @function toJSON
     * @memberof Response
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Response.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Response
     * @function getTypeUrl
     * @memberof Response
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Response.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Response";
    };

    return Response;
})();

export const Event = $root.Event = (() => {

    /**
     * Properties of an Event.
     * @exports IEvent
     * @interface IEvent
     * @property {google.protobuf.IAny|null} [event] Event event
     */

    /**
     * Constructs a new Event.
     * @exports Event
     * @classdesc Represents an Event.
     * @implements IEvent
     * @constructor
     * @param {IEvent=} [properties] Properties to set
     */
    function Event(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Event event.
     * @member {google.protobuf.IAny|null|undefined} event
     * @memberof Event
     * @instance
     */
    Event.prototype.event = null;

    /**
     * Creates a new Event instance using the specified properties.
     * @function create
     * @memberof Event
     * @static
     * @param {IEvent=} [properties] Properties to set
     * @returns {Event} Event instance
     */
    Event.create = function create(properties) {
        return new Event(properties);
    };

    /**
     * Encodes the specified Event message. Does not implicitly {@link Event.verify|verify} messages.
     * @function encode
     * @memberof Event
     * @static
     * @param {IEvent} message Event message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Event.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.event != null && Object.hasOwnProperty.call(message, "event"))
            $root.google.protobuf.Any.encode(message.event, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Event message, length delimited. Does not implicitly {@link Event.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Event
     * @static
     * @param {IEvent} message Event message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Event.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Event message from the specified reader or buffer.
     * @function decode
     * @memberof Event
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Event} Event
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Event.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Event();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.event = $root.google.protobuf.Any.decode(reader, reader.uint32());
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Event message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Event
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Event} Event
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Event.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Event message.
     * @function verify
     * @memberof Event
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Event.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.event != null && message.hasOwnProperty("event")) {
            let error = $root.google.protobuf.Any.verify(message.event);
            if (error)
                return "event." + error;
        }
        return null;
    };

    /**
     * Creates an Event message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Event
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Event} Event
     */
    Event.fromObject = function fromObject(object) {
        if (object instanceof $root.Event)
            return object;
        let message = new $root.Event();
        if (object.event != null) {
            if (typeof object.event !== "object")
                throw TypeError(".Event.event: object expected");
            message.event = $root.google.protobuf.Any.fromObject(object.event);
        }
        return message;
    };

    /**
     * Creates a plain object from an Event message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Event
     * @static
     * @param {Event} message Event
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Event.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.event = null;
        if (message.event != null && message.hasOwnProperty("event"))
            object.event = $root.google.protobuf.Any.toObject(message.event, options);
        return object;
    };

    /**
     * Converts this Event to JSON.
     * @function toJSON
     * @memberof Event
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Event.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Event
     * @function getTypeUrl
     * @memberof Event
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Event.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Event";
    };

    return Event;
})();

export const google = $root.google = (() => {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    const google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        const protobuf = {};

        protobuf.Any = (function() {

            /**
             * Properties of an Any.
             * @memberof google.protobuf
             * @interface IAny
             * @property {string|null} [type_url] Any type_url
             * @property {Uint8Array|null} [value] Any value
             */

            /**
             * Constructs a new Any.
             * @memberof google.protobuf
             * @classdesc Represents an Any.
             * @implements IAny
             * @constructor
             * @param {google.protobuf.IAny=} [properties] Properties to set
             */
            function Any(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Any type_url.
             * @member {string} type_url
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.type_url = "";

            /**
             * Any value.
             * @member {Uint8Array} value
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.value = $util.newBuffer([]);

            /**
             * Creates a new Any instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny=} [properties] Properties to set
             * @returns {google.protobuf.Any} Any instance
             */
            Any.create = function create(properties) {
                return new Any(properties);
            };

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type_url != null && Object.hasOwnProperty.call(message, "type_url"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.type_url);
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
                return writer;
            };

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Any();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.type_url = reader.string();
                            break;
                        }
                    case 2: {
                            message.value = reader.bytes();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Any message.
             * @function verify
             * @memberof google.protobuf.Any
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Any.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    if (!$util.isString(message.type_url))
                        return "type_url: string expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                        return "value: buffer expected";
                return null;
            };

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Any
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Any} Any
             */
            Any.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Any)
                    return object;
                let message = new $root.google.protobuf.Any();
                if (object.type_url != null)
                    message.type_url = String(object.type_url);
                if (object.value != null)
                    if (typeof object.value === "string")
                        $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                    else if (object.value.length >= 0)
                        message.value = object.value;
                return message;
            };

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.Any} message Any
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Any.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.type_url = "";
                    if (options.bytes === String)
                        object.value = "";
                    else {
                        object.value = [];
                        if (options.bytes !== Array)
                            object.value = $util.newBuffer(object.value);
                    }
                }
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    object.type_url = message.type_url;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
                return object;
            };

            /**
             * Converts this Any to JSON.
             * @function toJSON
             * @memberof google.protobuf.Any
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Any.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Any
             * @function getTypeUrl
             * @memberof google.protobuf.Any
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Any.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/google.protobuf.Any";
            };

            return Any;
        })();

        return protobuf;
    })();

    return google;
})();

export { $root as default };
