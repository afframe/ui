import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1100, height: 1000 } });
const errs = [];
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
p.on('pageerror', (e) => errs.push(String(e)));
await p.goto('http://localhost:5199/');
await p.waitForSelector('main');
for (const [c, f] of [
  ['#0f62fe', 'blue'],
  ['#8a3ffc', 'purple'],
]) {
  await p.click(`button[aria-label="${c}"]`);
  await p
    .locator('[data-demo=data-table] tbody tr')
    .first()
    .locator('input[type=checkbox]')
    .check({ force: true });
  await p.mouse.move(1050, 5);
  await p.waitForTimeout(600);
  await p.screenshot({ path: `./accent-demo-${f}.png`, fullPage: true });
}
console.log(errs.slice(0, 5));
await b.close();
