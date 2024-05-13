# Wasimoff Experiments

This repository shall contain various experiments, API tests, benchmarks etc.
Anything worth keeping should be copied to the main codebase.

# JSperf.app Benchmarks

Sometimes it's not really worth it to setup an entire app just to test performance of a specific API.

* [**StructuredClone** vs. Transfer to a Worker](https://jsperf.app/mehofo/2)
  * sending ArrayBuffers to a Worker with `postMessage`, either let the runtime work its magic or manually clone and transfer it
  * clone (`buf.slice()`) and transfer is fastest but by *surprisingly little* margin (1600 vs. 1300 op/s, 20%)
  * contents of the buffer don't seem to make much difference (rand vs. zero)
  * cloning *and* copying is stupid ...
* [Many Messages on **MessageChannels**](https://jsperf.app/poguka/2)
  * creating 100 `MessageChannel`s and sending 10000 messages
  * either all on a single channel or spread across all channels evenly
  * no matter how the `chans`/`msgs` variables are set, the even spread is consistently faster (8.03 op/s ±3.50% vs. 4.75 op/s ±2.73%)
  * the bench does not create workers, so this is simply the efficiency of message handling on a single thread
* [Many Messages to **Workers**](https://jsperf.app/dehuje/2)
  * interestingly, the same does *not* hold for multiple Workers ..
  * sending all messages to *a single Worker is faster* (7.69 op/s ±6.99%) than spreading it across many (3.72 op/s ±2.99%)
  * so, even with an optimized Comlink, I *will* hit a performance bottleneck here
    * although, we're doing between 372.000 and 769.000 requests per second here ... 
