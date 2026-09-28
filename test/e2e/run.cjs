const fs = require('fs');
const path = require('path');
const http = require('http');
const assert = require('assert');
const { execFileSync, spawn } = require('child_process');
const root = path.resolve(__dirname, '../..');
const artifacts = path.join(__dirname, 'artifacts');
const consumer = path.join(artifacts, 'consumer');
function run(command, args, cwd = root) {
  return execFileSync(command, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
}
async function main() {
  fs.mkdirSync(consumer, { recursive: true });
  const registry = fs.readFileSync(path.join(root, 'src/mods.js'), 'utf8');
  console.log(run(path.join(root, 'node_modules/.bin/gulp'), ['build', '--channels=wx_lite']));
  assert.strictEqual(fs.readFileSync(path.join(root, 'src/mods.js'), 'utf8'), registry, 'custom build changed source registry');
  const packOutput = run('npm', ['pack', '--json', '--pack-destination', artifacts]);
  // npm can forward prepack's Gulp logs before the JSON payload.
  fs.writeFileSync(path.join(artifacts, 'pack.log'), packOutput);
  const pack = JSON.parse(packOutput.slice(packOutput.lastIndexOf('\n[\n') + 1));
  const tarball = path.join(artifacts, pack[0].filename);
  fs.writeFileSync(path.join(artifacts, 'pack.json'), JSON.stringify(pack, null, 2));
  fs.writeFileSync(path.join(consumer, 'package.json'), JSON.stringify({ private: true,
    dependencies: { 'pingpp-js': 'file:' + tarball, vite: '4.5.14', webpack: '5.98.0', vue: '3.5.13', react: '18.3.1', 'react-dom': '18.3.1' } }, null, 2));
  // Remove only the previously installed SDK so npm always installs this tarball.
  fs.rmSync(path.join(consumer, 'node_modules/pingpp-js'), { recursive: true, force: true });
  console.log(run('npm', ['install', '--no-audit', '--no-fund'], consumer));
  const sdk = require(path.join(consumer, 'node_modules/pingpp-js'));
  assert.strictEqual(typeof sdk.createPayment, 'function', 'CommonJS entry API');
  fs.copyFileSync(path.join(__dirname, 'checks.js'), path.join(consumer, 'checks.js'));
  fs.writeFileSync(path.join(consumer, 'index.html'), '<!doctype html><html><head><meta charset="utf-8"><title>Ping++ E2E</title></head><body><div id="root"></div><script type="module" src="/app.js"></script></body></html>');
  const { build } = require(path.join(consumer, 'node_modules/vite'));
  const webpack = require(path.join(consumer, 'node_modules/webpack'));
  const scenarios = [];
  for (const framework of ['react', 'vue']) {
    const source = fs.readFileSync(path.join(__dirname, framework === 'react' ? 'app.js' : 'vue-app.js'), 'utf8');
    fs.writeFileSync(path.join(consumer, 'app.js'), source);
    for (const [mode, strictRequires] of [['auto', 'auto'], ['hoisted', false]]) {
      const id = framework + '-vite-' + mode;
      await build({ root: consumer, configFile: false, base: './', logLevel: 'warn', build: {
        outDir: path.join(artifacts, id), emptyOutDir: true, commonjsOptions: { strictRequires }
      } });
      scenarios.push({ id, framework, bundler: 'vite', importStyle: 'import', mode });
    }
    for (const importStyle of ['require', 'import']) {
      const id = framework + '-webpack-' + importStyle;
      const outDir = path.join(artifacts, id);
      fs.writeFileSync(path.join(consumer, 'app.js'), importStyle === 'require' ?
        source.replace("import pingpp from 'pingpp-js';", "var pingpp = require('pingpp-js');") : source);
      await new Promise((resolve, reject) => {
        const compiler = webpack({ mode: 'production', context: consumer,
          entry: './app.js', output: { path: outDir, filename: 'app.js', clean: true },
          plugins: [new webpack.DefinePlugin({ __VUE_OPTIONS_API__: 'true',
            __VUE_PROD_DEVTOOLS__: 'false', __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false' })]
        });
        compiler.run((error, stats) => {
          const buildError = error || (stats.hasErrors() ? new Error(stats.toString({ all: false, errors: true })) : null);
          compiler.close(closeError => buildError || closeError ? reject(buildError || closeError) : resolve());
        });
      });
      fs.writeFileSync(path.join(outDir, 'index.html'), '<!doctype html><meta charset="utf-8"><title>Ping++ E2E</title><div id="root"></div><script src="./app.js"></script>');
      scenarios.push({ id, framework, bundler: 'webpack', importStyle, mode: 'production' });
    }
  }
  fs.mkdirSync(path.join(artifacts, 'dist'), { recursive: true });
  fs.copyFileSync(path.join(consumer, 'node_modules/pingpp-js/dist/pingpp.js'), path.join(artifacts, 'dist/pingpp.js'));
  fs.writeFileSync(path.join(artifacts, 'script-checks.js'),
    fs.readFileSync(path.join(__dirname, 'checks.js'), 'utf8').replace('export function', 'function'));
  fs.copyFileSync(path.join(__dirname, 'script-app.js'), path.join(artifacts, 'script-app.js'));
  for (const mode of ['classic', 'defer']) {
    const id = 'script-' + mode;
    const outDir = path.join(artifacts, id);
    const attribute = mode === 'defer' ? ' defer' : '';
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), '<!doctype html><meta charset="utf-8"><title>Ping++ script E2E</title>' +
      '<h1>Ping++ script tag: ' + mode + '</h1><button id="run">Run payment checks</button><pre id="results"></pre>' +
      '<script' + attribute + ' src="../dist/pingpp.js"></script>' +
      '<script' + attribute + ' src="../script-checks.js"></script>' +
      '<script' + attribute + ' src="../script-app.js"></script>');
    scenarios.push({ id, framework: 'none', bundler: 'none', importStyle: 'script tag', mode });
  }
  fs.writeFileSync(path.join(artifacts, 'scenarios.json'), JSON.stringify(scenarios, null, 2));
  const server = http.createServer((req, res) => {
    const relative = new URL(req.url, 'http://localhost').pathname;
    const file = path.join(artifacts, relative.endsWith('/') ? relative + 'index.html' : relative);
    if (!file.startsWith(artifacts + path.sep)) { res.writeHead(403).end(); return; }
    fs.readFile(file, (error, data) => {
      if (error) { res.writeHead(404).end(); return; }
      res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : 'text/html');
      res.end(data);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const options = { artifacts, scenarios, url: 'http://127.0.0.1:' + server.address().port, space: process.env.PINGPP_E2E_SPACE };
    const browserCode = 'const e2eOptions = ' + JSON.stringify(options) + ';\n' +
      fs.readFileSync(path.join(__dirname, 'browser.mjs'), 'utf8');
    const exitCode = await new Promise((resolve, reject) => {
      const child = spawn('ego-browser', ['nodejs', '-e', browserCode], { stdio: 'inherit' });
      child.on('error', reject);
      child.on('exit', resolve);
    });
    assert.strictEqual(exitCode, 0, 'browser E2E failed');
    console.log('Verified tarball and report: ' + artifacts);
  } finally {
    server.close();
    // Chromium can leave speculative connections open after its page closes.
    server.closeAllConnections();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
