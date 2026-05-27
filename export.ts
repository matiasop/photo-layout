import { chromium } from "playwright";
import { readdir, mkdir } from "fs/promises";
import { join, resolve, basename } from "path";

const postDir = process.argv[2];
if (!postDir) {
  console.error("Uso: bun export.ts posts/<nombre-post>");
  process.exit(1);
}

const date = new Date().toISOString().split("T")[0];
const postName = basename(postDir);
const outputDir = `export/${date}_${postName}`;

const htmlFiles = (await readdir(postDir))
  .filter((f) => f.endsWith(".html"))
  .sort((a, b) => parseInt(a) - parseInt(b));

if (htmlFiles.length === 0) {
  console.error(`No se encontraron archivos HTML en ${postDir}`);
  process.exit(1);
}

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1080, height: 1350 });

for (const file of htmlFiles) {
  const filePath = resolve(join(postDir, file));
  await page.goto(`file://${filePath}`);
  await page.waitForLoadState("networkidle");
  const outFile = `${outputDir}/${file.replace(".html", ".png")}`;
  await page.screenshot({ path: outFile, fullPage: false });
  console.log(`✓ ${outFile}`);
}

await browser.close();
console.log(`\nExportadas ${htmlFiles.length} páginas → ${outputDir}/`);
