# SharedProvider

This is an example of a `SharedWorker`, which is shared among multiple tabs and
spawns a number of `Worker` threads only once per context. It also comes with a
second vite config to bundle up the class into a library file for consumption.

### Development

```
yarn install
yarn dev
```

... as usual.

### Bundle

```
yarn install
yarn lib
```

Then open with any HTTP server:

```
python -m http.server
xdg-open http://localhost:8000/dist.html
```
