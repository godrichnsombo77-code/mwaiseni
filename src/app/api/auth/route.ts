import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: "Mot de passe requis" }, { status: 400 });
    }

    const adminPassword = process.env.ADMIN_PASSWORD || "Mwaiseni@Admin2026";
    const editorPassword = process.env.EDITOR_PASSWORD || "Mwaiseni@Editor2026";

    if (password === adminPassword) {
      return NextResponse.json({ role: "super_admin", token: "sa_" + Date.now() });
    }

    if (password === editorPassword) {
      return NextResponse.json({ role: "editor", token: "ed_" + Date.now() });
    }

    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
