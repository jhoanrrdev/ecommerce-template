import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "ID invalido" }, { status: 400 });
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Categoria no encontrada" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const name =
      body.name !== undefined
        ? String(body.name || "").trim()
        : existingCategory.name;
    const active =
      body.active !== undefined ? Boolean(body.active) : existingCategory.active;

    if (!name) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    const slug = slugify(name);

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        active,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error al actualizar categoria:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar la categoria" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "ID invalido" }, { status: 400 });
    }

    const productsCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        { error: "No puedes eliminar una categoria con productos asociados" },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al eliminar categoria:", error);
    return NextResponse.json(
      { error: "No se pudo eliminar la categoria" },
      { status: 500 }
    );
  }
}
