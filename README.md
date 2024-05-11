# Wasimoff Experiments

This repository shall contain various experiments, API tests, benchmarks etc.
Anything worth keeping should be copied to the main codebase.

# JSperf.app Benchmarks

Sometimes it's not really worth it to setup an entire app just to test performance of a specific API.

* [StructuredClone vs. Transfer to a Worker](https://jsperf.app/mehofo)
  * sending ArrayBuffers to a Worker with `postMessage`, either let the runtime work its magic or manually clone and transfer it
  * clone (`buf.slice()`) and transfer is fastest but by *surprisingly little* margin (1600 vs. 1300 op/s, 20%)
  * contents of the buffer don't seem to make much difference (rand vs. zero)
  * cloning *and* copying is stupid ...
