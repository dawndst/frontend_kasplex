import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:8095';
const OUT = new URL('./shots/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const PAGES = [
  { path: '/#/',              name: '01-home' },
  { path: '/#/evm',           name: '02-ecosystem' },
  { path: '/#/faucet',        name: '03-faucet' },
  { path: '/#/mediaKit',      name: '04-mediakit' },
  { path: '/#/privacypolicy', name: '05-privacypolicy' },
  { path: '/#/stats',         name: '06-stats' },
  { path: '/#/verify',        name: '07-verify' },
];

const browser = await chromium.launch();

async function shoot(viewport, suffix, pages) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  for (const { path, name } of pages) {
    await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 45000 })
      .catch(() => console.log(`  (networkidle timeout on ${path}, shooting anyway)`));
    await page.waitForTimeout(2500); // let WebGL/animations settle
    const file = `${OUT}${name}${suffix}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log(`captured ${name}${suffix}`);
  }
  await ctx.close();
}

await shoot({ width: 1440, height: 900 }, '-desktop', PAGES);
await shoot({ width: 390, height: 844 }, '-mobile', PAGES.slice(0, 1));

await browser.close();
console.log('done');
