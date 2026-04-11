import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error al listar pedidos:", error);
    return NextResponse.json(
      { error: "No se pudieron listar los pedidos" },
      { status: 500 }
    );
  }
}
