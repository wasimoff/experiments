# Running golang/benchmarks on Wasm

I found a repository https://github.com/golang/benchmarks with
a number of macro-benchmarks for their perf dashboard. The dash
only shows a single architecture though, as the main idea is to
show regressions across commits and not compare architectures.

Anyway. Checkout the repository somewhere. The results commited
here are from commit 5d13331. Further relevant software is listed
here:

* Go: `go version go1.24.0 linux/amd64`
* Wasmtime: `wasmtime 29.0.1 (58282df89 2025-01-21)`
* Kernel: `Linux 5.15.167.4-microsoft-standard-WSL2 x86_64 GNU/Linux`


Create a subdirectory and compile all the binaries for your native
platform and for WebAssembly. Some benchmarks, like `build`, will
compile to WebAssembly but won't run because you can't invoke the
`go` binary from there. I haven't attempted to run the `sweet` suite
either.

    mkdir compiled/ && cd compiled/
    for cmd in garbage http json; do
        go build ../$cmd/
        GOARCH=wasm GOOS=wasip1 go build -o $cmd.wasm ../$cmd/
    done

Next, run the benchmarks a few times and log the results to a file.
Increase `-benchnum` or `-benchtime` if the results don't seem to be
significant enough. The `GOMAXPROCS` is there to constrain the Go
runtime to a single core, as the WebAssembly runtime cannot use more
than one either.

    for cmd in garbage http json; do
        GOMAXPROCS=1 ./$cmd -benchnum 6 >> results.txt
        wasmtime --dir /tmp ./$cmd.wasm -benchnum 6 >> results.txt
    done

Finally, analyse the results with [`benchstat`]().
It took me a while to find the correct arguments to show all the
results across platforms in a single table, so here goes:

    benchstat -ignore goos -row .name -col goarch \
      -filter ".unit:(P95-sec/op OR ns/op OR allocated-bytes/op)" \
      results.txt

It looks something like this on my machine:

```
        │    amd64    │                 wasm                 │
        │   sec/op    │    sec/op     vs base                │
Garbage   6.912m ± 4%   25.196m ± 2%  +264.50% (p=0.002 n=6)
HTTP      14.42µ ± 1%    78.87µ ± 1%  +447.02% (p=0.002 n=6)
JSON      21.34m ± 1%   102.39m ± 4%  +379.74% (p=0.002 n=6)
geomean   1.286m         5.882m       +357.34%

        │       amd64        │                   wasm                    │
        │ allocated-bytes/op │ allocated-bytes/op  vs base               │
Garbage         2.619Mi ± 0%         2.627Mi ± 0%   +0.34% (p=0.002 n=6)
HTTP            5.386Ki ± 0%         6.170Ki ± 0%  +14.57% (p=0.002 n=6)
JSON            3.986Mi ± 2%         3.858Mi ± 1%   -3.20% (p=0.002 n=6)
geomean         389.2Ki              403.3Ki        +3.62%

     │    amd64    │                 wasm                 │
     │ P95-sec/op  │  P95-sec/op   vs base                │
HTTP   76.75µ ± 3%   433.83µ ± 2%  +465.24% (p=0.002 n=6)
```
