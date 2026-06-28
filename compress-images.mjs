/**
 * SSK Image Compressor
 * Run from the project root: node compress-images.mjs
 *
 * Converts large PNGs/JPEGs to optimised JPEG (quality 85, max 1600px wide)
 * then patches products.ts so image paths point to the new .jpg files.
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DIRS = [
  "public/images/shop/clothing",
  "public/images/shop/accessories",
  "public/images/branding",
  "public/images/community",
];

const PRODUCTS_TS = "src/lib/products.ts";
const MAX_WIDTH = 1600;
const QUALITY = 85;

let beforeTotal = 0;
let afterTotal = 0;
const renamed = {}; // old web path -> new web path

async function processDir(dir) {
  const full = path.join(__dirname, dir);
  if (!fs.existsSync(full)) {
    console.log(`Skipping ${dir} (not found)`);
    return;
  }

  const files = fs.readdirSync(full);
  for (const fname of files.sort()) {
    const ext = fname.split(".").pop().toLowerCase();
    if (!["png", "jpg", "jpeg"].includes(ext)) continue;

    const src = path.join(full, fname);
    const base = fname.slice(0, fname.lastIndexOf("."));
    const dst = path.join(full, base + ".jpg");

    const beforeSize = fs.statSync(src).size;
    beforeTotal += beforeSize;

    try {
      const meta = await sharp(src).metadata();
      let pipeline = sharp(src);

      if (meta.width > MAX_WIDTH) {
        pipeline = pipeline.resize(MAX_WIDTH, null, { fit: "inside" });
      }

      await pipeline
        .jpeg({ quality: QUALITY, progressive: true, mozjpeg: false })
        .toFile(dst + ".tmp");

      // Atomic replace
      fs.renameSync(dst + ".tmp", dst);

      const afterSize = fs.statSync(dst).size;
      afterTotal += afterSize;
      const savedPct = (((beforeSize - afterSize) / beforeSize) * 100).toFixed(0);
      const status = ext !== "jpg" ? "→ NEW" : "↺ OPT";
      console.log(
        `${status}  ${fname.padEnd(50)}  ${Math.round(beforeSize / 1024).toString().padStart(5)} KB → ${Math.round(afterSize / 1024).toString().padStart(4)} KB  (${savedPct}% saved)`
      );

      if (ext !== "jpg") {
        const relSrc = "/" + dir.replace(/\\/g, "/") + "/" + fname;
        const relDst = "/" + dir.replace(/\\/g, "/") + "/" + base + ".jpg";
        renamed[relSrc] = relDst;
      }
    } catch (err) {
      beforeTotal -= beforeSize; // don't count it in totals
      console.log(`✗ SKIP  ${fname.padEnd(50)}  (${err.message})`);
    }
  }
}

async function main() {
  for (const dir of DIRS) {
    await processDir(dir);
  }

  const mb = (n) => (n / 1024 / 1024).toFixed(1);
  console.log("\n" + "=".repeat(60));
  console.log(
    `TOTAL  ${mb(beforeTotal)} MB  →  ${mb(afterTotal)} MB  (${(((beforeTotal - afterTotal) / beforeTotal) * 100).toFixed(0)}% saved)`
  );
  console.log("=".repeat(60) + "\n");

  // Patch products.ts
  const tsPath = path.join(__dirname, PRODUCTS_TS);
  if (Object.keys(renamed).length > 0 && fs.existsSync(tsPath)) {
    let content = fs.readFileSync(tsPath, "utf-8");
    let patched = content;
    for (const [oldPath, newPath] of Object.entries(renamed)) {
      patched = patched.split(oldPath).join(newPath);
    }
    if (patched !== content) {
      fs.writeFileSync(tsPath, patched, "utf-8");
      console.log(`✓ Patched ${PRODUCTS_TS} — updated ${Object.keys(renamed).length} path(s) to .jpg`);
    } else {
      console.log(`ℹ  ${PRODUCTS_TS} already up to date`);
    }
  }

  console.log("\nDone! Run:  vercel --prod");
  console.log("Once live looks good, delete the old .png files from public/images/");
}

main().catch(console.error);
