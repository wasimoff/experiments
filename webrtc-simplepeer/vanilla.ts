#!/usr/bin/env -S deno run --allow-ffi

// polyfill the WebRTC API
import webrtc from 'webrtc-polyfill';
for (const [k, fn] of Object.entries(webrtc)) if (k !== "default") globalThis[k] ??= fn;

// begin a new connection
const connection = new RTCPeerConnection();

// open a datachannel
const channel = new Promise(resolve => {
  const chan = connection.createDataChannel('boop');
  chan.onopen = () => { if (chan.readyState === 'open') resolve(chan); };
});

// create an offer and print it
const offer = new RTCSessionDescription(await connection.createOffer());
console.log(offer);

connection.setLocalDescription(offer);
connection.onicecandidate = ({candidate}) => {
  if (!candidate) return;
  // collect `candidate` somewhere
  console.log("candidate:", candidate);
};
connection.onicegatheringstatechange = _ => {
  if (connection.iceGatheringState === 'complete') {
    // We are done collecting candidates
    console.log("candidate collection complete.");
  }
};
