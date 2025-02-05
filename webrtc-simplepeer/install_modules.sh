#!/usr/bin/env bash

# use a container: docker run --rm -it -v ./:/simplepeer -w /simplepeer denoland/deno:2.1.9 bash

# install node_modules
set -x
deno install --node-modules-dir=auto --allow-scripts npm:simple-peer npm:webrtc-polyfill
