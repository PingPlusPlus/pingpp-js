const fs = await import('node:fs/promises');
const path = await import('node:path');
// e2eOptions is prepended by run.cjs; ego-browser runs in its own process.
const artifactDir = e2eOptions.artifacts;
const task = e2eOptions.space ? await taskSpace(Number(e2eOptions.space)) : await taskSpace('Ping++ npm E2E');
console.log('Browser task space: ' + task.spaceId);
await fs.writeFile(path.join(artifactDir, 'browser-space.json'), JSON.stringify({ spaceId: task.spaceId }));
const page = task.page('p1');
const report = { generatedAt: new Date().toISOString(), scenarios: [] };
try {
  for (const scenario of e2eOptions.scenarios) {
    await page.goto(e2eOptions.url + '/' + scenario.id + '/');
    await page.waitForSelector('button');
    await page.click('text="Run payment checks"');
    await page.waitForFunction(() => window.paymentResults);
    const checks = await page.evaluate(() => window.paymentResults);
    report.scenarios.push({ ...scenario, checks });
    console.log(scenario.id + ': ' + checks.filter(check => check.passed).length + '/' + checks.length + ' passed');
    await fs.writeFile(path.join(artifactDir, 'report.json'), JSON.stringify(report, null, 2));
  }
  report.passed = report.scenarios.every(s => s.checks.every(c => c.passed));
  console.log('All browser checks passed: ' + report.passed);
} catch (error) {
  report.passed = false;
  report.error = error.message;
  throw error;
} finally {
  const json = JSON.stringify(report, null, 2);
  await fs.writeFile(path.join(artifactDir, 'report.json'), json);
  const escaped = json.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  await fs.writeFile(path.join(artifactDir, 'report.html'),
    '<!doctype html><meta charset="utf-8"><title>Ping++ Vue / React / script E2E</title><h1>Ping++ Vue / React / script E2E</h1><pre>' + escaped + '</pre>');
  if (report.passed) await task.finish({ keep: [] });
}
if (!report.passed) throw new Error('Payment integration failed; see report.json');
