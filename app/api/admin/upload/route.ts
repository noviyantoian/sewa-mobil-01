import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/auth/guard";
import { r2Configured, uploadToR2 } from "@/lib/storage/r2";

const MAX_BYTES = 5 * 1024 * 1024;
const EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
};

/** Detect image type from magic bytes — never trust the client's Content-Type. */
function sniffImageMime(b: Uint8Array): string | null {
  if (b.length < 12) return null;
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  )
    return "image/webp";
  if (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) {
    const head = String.fromCharCode(...Array.from(b.slice(0, 32)));
    if (head.includes("avif") || head.includes("avis")) return "image/avif";
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mime = sniffImageMime(bytes);
  if (!mime) return NextResponse.json({ error: "bad_type" }, { status: 400 });
  const key = `cars/${randomUUID()}.${EXT[mime]}`;

  // Storage is Cloudflare R2 (set the R2_* env). No Supabase fallback.
  if (!r2Configured()) {
    console.error("[upload] R2 not configured — set R2_* env vars");
    return NextResponse.json({ error: "storage_not_configured" }, { status: 500 });
  }

  try {
    const url = await uploadToR2(key, bytes, mime);
    return NextResponse.json({ url });
  } catch (e) {
    console.error("[upload]", e);
    return NextResponse.json({ error: "upload_failed" }, { status: 500 });
  }
}
