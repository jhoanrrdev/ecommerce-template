import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(promotions);
  } catch (error) {
    console.error("Error al listar promociones:", error);
    return NextResponse.json(
      { error: "No se pudieron listar las promociones" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = String(body.title || "").trim();
    const type = String(body.type || "porcentaje").trim();
    const value = Number(body.value || 0);
    const active = body.active !== undefined ? Boolean(body.active) : true;
    const startDate = body.startDate ? new Date(body.startDate) : null;
    const endDate = body.endDate ? new Date(body.endDate) : null;

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

    const promotion = await prisma.promotion.create({
      data: {
        title,
        type,
        value,
        active,
        startDate,
        endDate,
      },
    });

    return NextResponse.json(promotion, { status: 201 });
  } catch (error) {
    console.error("Error al crear promocion:", error);
    return NextResponse.json(
      { error: "No se pudo crear la promocion" },
      { status: 500 }
    );
  }
}
