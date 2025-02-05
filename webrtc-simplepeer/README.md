# WebRTC P2P Example

This is a simple data-channel example showing off connectivity between Deno and Go clients.

* Deno (JavaScript) uses the [`simple-peer`](https://www.npmjs.com/package/simple-peer) library and needs a polyfill for the WebRTC API. Equivalent code should run in the browser without the polyfill.
* Go uses the [`pion/webrtc`](https://github.com/pion/webrtc/tree/master) library.

I tested it with one client running on a Hetzner VPS *inside a Docker container*  and the other one being local on my computer .. *and it worked*.

The APIs need to be wrapped a little nicer for usage as a module in Wasimoff but it shows that it is technically possible to connect clients and providers easily, irrespective of the specific platform, as long as a standards-compliant WebRTC implementation is available.

---

1. Start the initiator with Deno: `./simple-peer.ts init`
2. Start the other peer in Go with: `go run ./pion-peer.go`
3. Wait a moment and copy the offer JSON from initiator to pion.
4. Copy the answer from pion back to the initiator.
5. Watch as the connection is established and both start sending current datetime to each other.
