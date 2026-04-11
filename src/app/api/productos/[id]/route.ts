import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return NextResponse.json(
      { error: "No se pudo obtener el producto" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await req.json();
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    const name =
      body.name !== undefined
        ? String(body.name || "").trim()
        : existingProduct.name;
    const description =
      body.description !== undefined
        ? body.description
          ? String(body.description).trim()
          : null
        : existingProduct.description;
    const price =
      body.price !== undefined ? Number(body.price) : existingProduct.price;
    const promoPrice =
      body.promoPrice !== undefined
        ? body.promoPrice !== null && body.promoPrice !== ""
          ? Number(body.promoPrice)
          : null
        : existingProduct.promoPrice;
    const stock =
      body.stock !== undefined ? Number(body.stock) : existingProduct.stock;
    const sku =
      body.sku !== undefined
        ? body.sku
          ? String(body.sku).trim()
          : null
        : existingProduct.sku;
    const imageUrl =
      body.imageUrl !== undefined
        ? body.imageUrl
          ? String(body.imageUrl).trim()
          : null
        : existingProduct.imageUrl;
    const active =
      body.active !== undefined ? Boolean(body.active) : existingProduct.active;
    const featured =
      body.featured !== undefined
        ? Boolean(body.featured)
        : existingProduct.featured;
    const categoryId =
      body.categoryId !== undefined
        ? body.categoryId !== null && body.categoryId !== ""
          ? Number(body.categoryId)
          : null
        : existingProduct.categoryId;

    if (!name) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    if (Number.isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: "El precio debe ser valido" },
        { status: 400 }
      );
    }

    if (Number.isNaN(stock) || stock < 0) {
      return NextResponse.json(
        { error: "El stock debe ser valido" },
        { status: 400 }
      );
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
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

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar el producto" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return NextResponse.json(
      { error: "No se pudo eliminar el producto" },
      { status: 500 }
    );
  }
}
