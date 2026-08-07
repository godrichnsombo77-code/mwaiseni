import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await db.product.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, brand, desc, img, tag, gradient } = body;

    if (!name || !brand || !desc || !img || !tag || !gradient) {
      return NextResponse.json(
        { error: "Tous les champs sont requis (name, brand, desc, img, tag, gradient)" },
        { status: 400 }
      );
    }

    const maxOrder = await db.product.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const product = await db.product.create({
      data: {
        name,
        brand,
        desc,
        img,
        tag,
        gradient,
        order: (maxOrder?.order || 0) + 1,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
  }
}
