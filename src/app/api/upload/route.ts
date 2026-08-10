import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { requireSession } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: Request) {
  try {
    await requireSession();

    const formData = await request.formData();
    const value = formData.get("file");

    if (!(value instanceof File)) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(value.type)) {
      return NextResponse.json({ error: "Format d'image non supporté" }, { status: 400 });
    }

    if (value.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Image trop volumineuse (5 Mo maximum)" }, { status: 413 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: "Stockage d'images non configuré" }, { status: 503 });
    }

    const extension = value.type === "image/jpeg" ? "jpg" : value.type.split("/")[1];
    const blob = await put(`products/${randomUUID()}.${extension}`, value, {
      access: "public",
      contentType: value.type,
      addRandomSuffix: false,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
  }
}
