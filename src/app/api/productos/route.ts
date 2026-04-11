import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error al listar productos:", error);
    return NextResponse.json(
      { error: "No se pudieron listar los productos" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const description = body.description ? String(body.description).trim() : null;
    const price = Number(body.price || 0);
    const promoPrice =
      body.promoPrice !== undefined && body.promoPrice !== null && body.promoPrice !== ""
        ? Number(body.promoPrice)
        : null;
    const stock = Number(body.stock || 0);
    const sku = body.sku ? String(body.sku).trim() : null;
    const imageUrl = body.imageUrl ? String(body.imageUrl).trim() : null;
    const active = body.active !== undefined ? Boolean(body.active) : true;
    const featured = body.featured !== undefined ? Boolean(body.featured) : false;
    const categoryId =
      body.categoryId !== undefined && body.categoryId !== null && body.categoryId !== ""
        ? Number(body.categoryId)
        : null;

    if (!name) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    if (Number.isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: "El precio debe ser válido" },
        { status: 400 }
      );
    }

    if (Number.isNaN(stock) || stock < 0) {
      return NextResponse.json(
        { error: "El stock debe ser válido" },
        { status: 400 }
      );
    }

    let slug = slugify(name);

    const existingSlug = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        promoPrice,
        stock,
        sku,
        imageUrl,
        active,
        featured,
        categoryId,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error al crear producto:", error);
    return NextResponse.json(
      { error: "No se pudo crear el producto" },
      { status: 500 }
    );
  }
}