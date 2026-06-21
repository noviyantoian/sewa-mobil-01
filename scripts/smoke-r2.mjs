// Live R2 connectivity check. Run: node --env-file=.env scripts/smoke-r2.mjs
// Verifies creds (PutObject auth) + bucket + public read, then cleans up.
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

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
  console.error("  Isi 5 var R2_* di .env dulu (lihat .env.example).");
  process.exit(1);
}

const bucket = process.env.R2_BUCKET;
const base = process.env.R2_PUBLIC_BASE_URL.replace(/\/$/, "");
const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const key = `cars/_smoke-test.png`;
// 1x1 transparent PNG
const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64",
);

try {
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: png,
      ContentType: "image/png",
    }),
  );
  console.log(`✓ PUT ok → bucket "${bucket}" (creds valid)`);
} catch (e) {
  console.error("✗ PUT failed:", e.name, "-", e.message);
  console.error("  Cek Account ID / Access Key / Secret / nama bucket.");
  process.exit(1);
}

const url = `${base}/${key}`;
try {
  const res = await fetch(url);
  if (res.status === 200) {
    console.log(`✓ GET ok → ${url} (${res.headers.get("content-type")})`);
    console.log("✓ Public access aktif. R2 siap dipakai.");
  } else {
    console.error(`✗ GET ${url} → ${res.status}`);
    console.error(
      "  PUT jalan tapi baca publik gagal — aktifkan Public access bucket (r2.dev / custom domain) & pastikan R2_PUBLIC_BASE_URL benar.",
    );
  }
} catch (e) {
  console.error("✗ GET failed:", e.message);
}

try {
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  console.log("✓ cleanup ok");
} catch (e) {
  console.error("! cleanup gagal (abaikan):", e.message);
}
