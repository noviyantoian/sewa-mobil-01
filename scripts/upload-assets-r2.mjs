// One-off: upload everything under public/images/** to R2, preserving paths.
// Key = path relative to public/ (e.g. images/mobil-01-exterior.webp), so the
// public URL becomes ${R2_PUBLIC_BASE_URL}/images/...  Run:
//   node --env-file=.env scripts/upload-assets-r2.mjs
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, relative, extname, sep } from "node:path";

const CT = {
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".avif": "image/avif",
};

const need = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET",
  "R2_PUBLIC_BASE_URL",
];
const missing = need.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("✗ MISSING env:", missing.join(", "));
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const bucket = process.env.R2_BUCKET;
const base = process.env.R2_PUBLIC_BASE_URL.replace(/\/$/, "");

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const files = (await walk("public/images")).filter(
  (f) => CT[extname(f).toLowerCase()],
);
let ok = 0;
for (const f of files) {
  const key = relative("public", f).split(sep).join("/"); // images/...
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: readFileSync(f),
        ContentType: CT[extname(f).toLowerCase()],
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
    ok++;
    console.log("↑", `${base}/${key}`);
  } catch (e) {
    console.error("✗", key, "-", e.name, e.message);
  }
}
console.log(`\nDone: ${ok}/${files.length} uploaded to bucket "${bucket}".`);
