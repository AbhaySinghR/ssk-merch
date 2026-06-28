"""
SSK Image Compressor
Run once from the project root: python compress-images.py

What it does:
  - Converts all product/community PNGs and JPEGs to optimised JPEG (quality 85)
  - Saves them with a .jpg extension alongside the originals
  - Prints a patch for products.ts so you can copy-paste the updated image paths
  - Does NOT delete the originals (safe to re-run)

Requirements: pip install pillow
"""

from PIL import Image
import os, re

DIRS = [
    "public/images/shop/clothing",
    "public/images/shop/accessories",
    "public/images/branding",
    "public/images/community",
]

PRODUCTS_TS = "src/lib/products.ts"

before_total = after_total = 0
renamed: dict[str, str] = {}  # old_path -> new_path (relative to public/)

for d in DIRS:
    if not os.path.isdir(d):
        print(f"Skipping {d} (not found)")
        continue
    for fname in sorted(os.listdir(d)):
        ext = fname.lower().rsplit(".", 1)[-1]
        if ext not in ("png", "jpg", "jpeg"):
            continue

        src = os.path.join(d, fname)
        base = fname.rsplit(".", 1)[0]
        dst = os.path.join(d, base + ".jpg")

        before = os.path.getsize(src)
        before_total += before

        img = Image.open(src).convert("RGB")

        # Cap at 1600px wide — plenty for a product shot displayed at 25vw
        if img.width > 1600:
            ratio = 1600 / img.width
            img = img.resize((1600, int(img.height * ratio)), Image.LANCZOS)

        img.save(dst, "JPEG", quality=85, optimize=True, progressive=True)

        after = os.path.getsize(dst)
        after_total += after

        saved_pct = (before - after) / before * 100
        status = "→ NEW" if not src.endswith(".jpg") or src != dst else "↺ OPT"
        print(f"{status}  {fname:50s}  {before // 1024:5d} KB → {after // 1024:4d} KB  ({saved_pct:.0f}% saved)")

        # Track renames for products.ts patch (only if extension changed)
        if ext != "jpg":
            rel_src = src.replace("public", "").replace("\\", "/")
            rel_dst = dst.replace("public", "").replace("\\", "/")
            renamed[rel_src] = rel_dst

print(f"\n{'='*60}")
print(f"TOTAL  {before_total // 1024 // 1024} MB  →  {after_total // 1024 // 1024} MB  "
      f"({(before_total - after_total) / before_total * 100:.0f}% saved)")
print(f"{'='*60}\n")

# ── Patch products.ts automatically ─────────────────────────────────────────
if renamed and os.path.exists(PRODUCTS_TS):
    with open(PRODUCTS_TS, "r", encoding="utf-8") as f:
        content = f.read()

    patched = content
    for old, new in renamed.items():
        patched = patched.replace(old, new)

    if patched != content:
        with open(PRODUCTS_TS, "w", encoding="utf-8") as f:
            f.write(patched)
        print(f"✓ Patched {PRODUCTS_TS} — updated {len(renamed)} image path(s) to .jpg")
    else:
        print(f"ℹ  No changes needed in {PRODUCTS_TS} (paths already up to date)")
else:
    print("ℹ  No renames or products.ts not found — skipping patch")

print("\nDone! Next steps:")
print("  1. Verify images look correct in the browser (open public/images/shop/.../*.jpg)")
print("  2. Run:  vercel --prod")
print("  3. (Optional) Delete the original .png files once live looks good")
