import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/auth/guard";
import { createClient } from "@/lib/supabase/server";
import { r2Configured, uploadToR2 } from "@/lib/storage/r2";

const MAX_BYTES = 5 * 1024 * 1024;
const EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
};

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
  const ext = EXT[file.type];
  if (!ext) return NextResponse.json({ error: "bad_type" }, { status: 400 });
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const key = `cars/${randomUUID()}.${ext}`;

  try {
    if (r2Configured()) {
      const url = await uploadToR2(key, bytes, file.type);
      return NextResponse.json({ url });
    }
    // Fallback: Supabase Storage (upload runs as the authenticated admin).
    const supabase = await createClient();
    const { error } = await supabase.storage
      .from("assets")
      .upload(key, bytes, { contentType: file.type, upsert: false });
    if (error) {
      console.error("[upload] supabase", error);
      return NextResponse.json({ error: "upload_failed" }, { status: 500 });
    }
    const { data } = supabase.storage.from("assets").getPublicUrl(key);
    return NextResponse.json({ url: data.publicUrl });
  } catch (e) {
    console.error("[upload]", e);
    return NextResponse.json({ error: "upload_failed" }, { status: 500 });
  }
}
