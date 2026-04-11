import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const existingPromotion = await prisma.promotion.findUnique({
      where: { id },
    });

    if (!existingPromotion) {
      return NextResponse.json(
        { error: "Promocion no encontrada" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const title =
      body.title !== undefined
        ? String(body.title || "").trim()
        : existingPromotion.title;
    const type =
      body.type !== undefined ? String(body.type || "").trim() : existingPromotion.type;
    const value =
      body.value !== undefined ? Number(body.value) : existingPromotion.value;
    const active =
      body.active !== undefined ? Boolean(body.active) : existingPromotion.active;
    const startDate =
      body.startDate !== undefined
        ? body.startDate
          ? new Date(body.startDate)
          : null
        : existingPromotion.startDate;
    const endDate =
      body.endDate !== undefined
        ? body.endDate
          ? new Date(body.endDate)
          : null
        : existingPromotion.endDate;

    if (!title) {
      return NextResponse.json(
        { error: "El titulo es obligatorio" },
        { status: 400 }
      );
    }

    if (Number.isNaN(value) || value < 0) {
      return NextResponse.json(
        { error: "El valor de la promocion debe ser valido" },
        { status: 400 }
      );
    }

    const promotion = await prisma.promotion.update({
      where: { id },
      data: {
        title,
        type,
        value,
        active,
        startDate,
        endDate,
      },
    });

    return NextResponse.json(promotion);
  } catch (error) {
    console.error("Error al actualizar promocion:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar la promocion" },
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

    await prisma.promotion.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al eliminar promocion:", error);
    return NextResponse.json(
      { error: "No se pudo eliminar la promocion" },
      { status: 500 }
    );
  }
}
