#!/usr/bin/env node

/**
 * Generate PWA icons from the source logo
 *
 * This script uses sharp to generate all required icon sizes
 * from the shieldfirelogo.png source file.
 */

import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_LOGO = path.join(__dirname, "..", "shieldfirelogo.png");
const PUBLIC_DIR = path.join(__dirname, "..", "public");

// Icon sizes needed for PWA
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  console.log("🎨 Generating PWA icons from shieldfirelogo.png...\n");

  // Check if source file exists
  try {
    await fs.access(SOURCE_LOGO);
  } catch (error) {
    console.error("❌ Source logo file not found:", SOURCE_LOGO);
    process.exit(1);
  }

  // Generate each icon size
  for (const size of ICON_SIZES) {
    const outputPath = path.join(PUBLIC_DIR, `icon-${size}x${size}.png`);

    try {
      await sharp(SOURCE_LOGO)
        .resize(size, size, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png({
          compressionLevel: 9,
          adaptiveFiltering: true,
        })
        .toFile(outputPath);

      console.log(`✅ Generated ${size}x${size} icon`);
    } catch (error) {
      console.error(
        `❌ Failed to generate ${size}x${size} icon:`,
        error.message
      );
    }
  }

  // Generate favicon.ico (32x32)
  const faviconPath = path.join(PUBLIC_DIR, "favicon.ico");
  try {
    await sharp(SOURCE_LOGO)
      .resize(32, 32, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toFile(faviconPath);

    console.log("✅ Generated favicon.ico");
  } catch (error) {
    console.error("❌ Failed to generate favicon.ico:", error.message);
  }

  console.log("\n✨ All icons generated successfully!");
}

await generateIcons();
