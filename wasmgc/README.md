# wasmgc

This is a tiny example to check if the WASM GC (Garbage Collection) extension is available in your browser. It is a copy of an older `browser_wasi_shim` index file and a compiled WASI file of [kotlin-wasm-examples/wasi-example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example).

Running the `kotlin.wasm` with `wasmtime` does indeed produce an error, as the `gc` extension [is not available there](https://github.com/bytecodealliance/wasmtime/issues/5032).

**Attention:** when instantiating this file, you need to use the exported `_initialize` function, instead of `_start`. It is a reactor module.

### Usage

Start a simple Python HTTP server for the files in this folder and open it in your browser.

    python -m http.server

Open the console, fetch the `kotlin.wasm` and call its `main`:

    let mod = await WebAssembly.compileStreaming(fetch("/kotlin.wasm"))
    let { wasi, instance } = await instantiate_wasi(mod, [], [])
    wasi.initialize(instance)

You should see a greeting:

    [WASI] Hello from Kotlin via WASI
    [WASI] Current 'realtime' timestamp is: 1719583733276000000
    [WASI] Current 'monotonic' timestamp is: 17621000000
