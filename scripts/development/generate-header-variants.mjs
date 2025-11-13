import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
}

async function captureVariants() {
  const projectRoot = path.resolve(__dirname, "..");
  const htmlPath = path.join(projectRoot, "docs", "header-variants.html");
  const outputRoot = path.join(projectRoot, "screenshots", "header-variants");

  await ensureDir(outputRoot);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 2,
  });

  await page.goto(`file://${htmlPath}`);

  for (let index = 1; index <= 10; index += 1) {
    const selector = `#variant-${index}`;
    const fileName = `header-variant-${index.toString().padStart(2, "0")}.png`;
    const outputPath = path.join(outputRoot, fileName);

    const locator = page.locator(selector);
    await locator.scrollIntoViewIfNeeded();
    await locator.waitFor();

    await locator.screenshot({
      path: outputPath,
      animations: "disabled",
      scale: "device",
    });

    console.log(`Captured ${fileName}`);
  }

  await browser.close();
}

try {
  await captureVariants();
} catch (error) {
  console.error("Failed to capture header variants:", error);
  process.exitCode = 1;
}
