# npm / Vue / React browser regression

Failure cases recorded before implementation:

- The npm tarball omits a supported channel after a custom channel build.
- CommonJS hoisting changes the initialization order of circular channel imports;
  `createPayment` reports `invalid_channel` or throws while reading extras.
- A Vue or React production bundle cannot import the SDK default export or use
  `var pingpp = require('pingpp-js')`.
- The WeChat channel aliases fail to reach the bridge, pass the wrong credential,
  or lose success/cancel/failure callbacks.
- Unknown channels stop returning the existing `invalid_channel` error.
- The script-tag bundle or CommonJS entry loses its public API.
- Classic or deferred script loading loses `window.pingpp`, requires a module
  loader, or fails to dispatch WeChat channel callbacks.
- Gulp completes before output is written, or swallows a build failure.

Run only when implementation is complete:

```sh
npm run test:e2e
```

Requires Node.js >= 18, npm, and the connected `ego-browser` CLI. The runner packs
and installs the actual package in a temporary consumer, then runs browser checks:

| Framework | Bundler | SDK entry |
| --- | --- | --- |
| Vue 3.5.13 / React 18.3.1 | Vite 4.5.14, automatic and hoisted CommonJS | `import pingpp from 'pingpp-js'` |
| Vue 3.5.13 / React 18.3.1 | Webpack 5.98.0, production | `var pingpp = require('pingpp-js')` |
| Vue 3.5.13 / React 18.3.1 | Webpack 5.98.0, production | `import pingpp from 'pingpp-js'` |

Vite cases use ESM application imports; Webpack cases also exercise literal
CommonJS calls in application code without special SDK configuration. Each of
the eight builds mounts a real framework component and invokes the SDK from its
button event. Only package-root imports are used in the framework builds.
Two additional pages load `dist/pingpp.js` directly through classic and deferred
script tags, with no framework, module loader, or bundler. Both verify the global
API and run the same payment callback checks.

It first builds a custom `wx_lite` bundle to verify that packing restores the full
release and does not change source registration. Artifacts (tarball, production
builds, JSON/HTML assertion reports, and dependency lockfile) are kept in
`test/e2e/artifacts/`. Re-running the command recreates these artifacts.

Only the host WeChat bridge is simulated. No real payment is submitted; these
checks cover package integration and SDK dispatch, not WeChat authentication or
settlement. They do not constitute a full uni-app device test.

## Custom PC build

```sh
node test/e2e/custom-build.cjs
```

Runs `gulp build --name="pingppPc" --channels="alipay_pc_direct upacp_pc"`
in an isolated copy and preserves the working tree's existing `dist/pingpp.js`.
Failure cases covered: incorrect global name, version mismatch, unavailable
selected channels, changed URL/form credentials, and accidentally included
WeChat channels. The browser checks Alipay's returned URL and intercepts UnionPay
form submission; no payment request is sent. The custom bundle, build log, and
JSON/HTML reports are retained in `test/e2e/artifacts/custom-build/`.
