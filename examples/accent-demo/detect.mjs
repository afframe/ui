import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1100, height: 1000 } });
await p.goto('http://localhost:5199/');
await p.waitForSelector('main');
await p.addStyleTag({
  content: '*{animation:none!important;transition:none!important}',
});
const pre = {
  'data-table': async () => {
    await p
      .locator('[data-demo=data-table] tbody tr')
      .first()
      .locator('label')
      .first()
      .click();
  },
  datepicker: async () => {
    await p.locator('#d-dp').click();
  },
  modal: async () => {
    await p.click('[data-testid=open-modal]');
  },
};
const ids = await p.$$eval('[data-demo]', (e) => e.map((x) => x.dataset.demo));
const shot = async (id) => {
  const el =
    id === 'modal'
      ? p.locator('.cds--modal-container')
      : p.locator(`[data-demo=${id}]`);
  if (id === 'datepicker')
    return await await p.locator('.flatpickr-calendar.open').screenshot();
  return el.screenshot();
};
const snap = async (c) => {
  await p.evaluate(() => {});
  await p.click(`button[aria-label="${c}"]`, { force: true });
  await p.mouse.move(1050, 5);
  await p.waitForTimeout(300);
  const o = {};
  for (const id of ids) {
    if (id === 'modal' || id === 'datepicker') continue;
    o[id] = (await shot(id)).toString('base64');
  }
  return o;
};
const a = await snap('#0f62fe'),
  a2 = await snap('#0f62fe'),
  c = await snap('#8a3ffc');
// interactive states
const inter = {};
for (const id of Object.keys(pre)) {
  inter[id] = [];
  for (const col of ['#0f62fe', '#8a3ffc']) {
    await p.goto('http://localhost:5199/');
    await p.waitForSelector('main');
    await p.addStyleTag({
      content: '*{animation:none!important;transition:none!important}',
    });
    await p.click(`button[aria-label="${col}"]`);
    await pre[id]();
    await p.mouse.move(1050, 5);
    await p.waitForTimeout(400);
    inter[id].push((await shot(id)).toString('base64'));
  }
}
for (const id of ids) {
  if (id === 'modal' || id === 'datepicker') continue;
  console.log(
    id.padEnd(26),
    a[id] !== c[id] ? 'CHANGES' : 'same',
    a[id] !== a2[id] ? '(noisy control)' : ''
  );
}
for (const id of Object.keys(inter))
  console.log(
    'interactive',
    id.padEnd(15),
    inter[id][0] !== inter[id][1] ? 'CHANGES' : 'same'
  );
await b.close();
