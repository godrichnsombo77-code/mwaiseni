import { NextResponse } from "next/server";
import { clearSession, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!password) {
      return NextResponse.json({ error: "Mot de passe requis" }, { status: 400 });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    const editorPassword = process.env.EDITOR_PASSWORD;

    if (!adminPassword || !editorPassword || !process.env.AUTH_SECRET) {
      return NextResponse.json(
        { error: "Authentification non configurée. Contactez l'administrateur." },
        { status: 503 }
      );
    }

    if (password === adminPassword) {
      return NextResponse.json(await createSession("super_admin"));
    }

    if (password === editorPassword) {
      return NextResponse.json(await createSession("editor"));
    }

    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE() {
  await clearSession();
  return NextResponse.json({ success: true });
}
