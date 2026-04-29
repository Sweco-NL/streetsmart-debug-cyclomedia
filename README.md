# StreetSmart — CSP `unsafe-eval` Issue

The StreetSmart point cloud viewer fails when served under a Content Security Policy that does not include `'unsafe-eval'` or `'wasm-unsafe-eval'`.

## Steps to reproduce

1. Copy `.env.example` to `.env.local` and fill in your credentials
2. Run:
   ```sh
   npm install
   npm start
   ```
3. Open the app in the browser and navigate to a location with a point cloud

**Expected:** point cloud renders normally  
**Actual:** the following error appears in the browser console:

```
UnityLoader.js:1 failed to asynchronously prepare wasm: CompileError:
WebAssembly.instantiate(): Compiling or instantiating WebAssembly module violates
the following Content Security policy directive because 'unsafe-eval' is not an
allowed source of script in the following Content Security Policy directive:
"script-src 'self' https://streetsmart.cyclomedia.com blob:"
```

## Workaround

In `vite.config.ts`, add `'wasm-unsafe-eval'` to `script-src`. The error disappears — however, **`'wasm-unsafe-eval'` is not an acceptable directive in our production CSP** and cannot be used as a fix.
