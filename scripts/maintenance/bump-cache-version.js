#!/usr/bin/env node

/**
 * Bump Cache Version Script
 *
 * Automatically increments the service worker cache version
 * to force all clients to download fresh content after deployment.
 *
 * Usage:
 *   node scripts/bump-cache-version.js
 *   pnpm bump-cache
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICE_WORKER_PATH = path.join(
  __dirname,
  "..",
  "public",
  "service-worker.js"
);

try {
  // Read service worker file
  let content = fs.readFileSync(SERVICE_WORKER_PATH, "utf-8");

  // Find current version
  const versionRegex = /const CACHE_VERSION = ["']v(\d+)["'];/;
  const match = content.match(versionRegex);

  if (!match) {
    console.error("❌ Could not find CACHE_VERSION in service-worker.js");
    console.error('   Expected format: const CACHE_VERSION = "v6";');
    process.exit(1);
  }

  const currentVersion = parseInt(match[1], 10);
  const newVersion = currentVersion + 1;

  // Replace version
  const newContent = content.replace(
    versionRegex,
    `const CACHE_VERSION = "v${newVersion}";`
  );

  // Write back to file
  fs.writeFileSync(SERVICE_WORKER_PATH, newContent, "utf-8");

  console.log("✅ Cache version bumped successfully!");
  console.log(`   v${currentVersion} → v${newVersion}`);
  console.log("");
  console.log("📋 Next steps:");
  console.log("   1. Test locally: pnpm build && pnpm preview");
  console.log("   2. Verify update notification appears");
  console.log("   3. Commit changes: git add public/service-worker.js");
  console.log("   4. Deploy to production 🚀");
} catch (error) {
  console.error("❌ Error bumping cache version:", error.message);
  process.exit(1);
}
