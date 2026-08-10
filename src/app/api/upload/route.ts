import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { requireSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export async function POST(request: Request) {
  try {
    await requireSession();

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return json({ error: "Stockage d'images non configuré" }, 503);
    }

    const formData = await request.formData();
    const value = formData.get("file");

    if (!(value instanceof File)) {
      return json({ error: "Aucun fichier fourni" }, 400);
    }

    if (!ALLOWED_TYPES.has(value.type)) {
      return json({ error: "Format d'image non supporté. Utilisez JPG, PNG, WebP ou GIF." }, 400);
    }

    if (value.size === 0) {
      return json({ error: "Le fichier image est vide" }, 400);
    }

    if (value.size > MAX_FILE_SIZE) {
      return json({ error: "Image trop volumineuse (5 Mo maximum)" }, 413);
    }

    const extension = value.type === "image/jpeg" ? "jpg" : value.type.split("/")[1];
    const blob = await put(`products/${randomUUID()}.${extension}`, value, {
      access: "public",
      contentType: value.type,
      addRandomSuffix: false,
    });

    return json({ url: blob.url });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return json({ error: "Non autorisé. Veuillez vous reconnecter." }, 401);
    }
    console.error("Upload error:", error);
    return json({ error: "Erreur lors de l'envoi de l'image" }, 500);
  }
}
