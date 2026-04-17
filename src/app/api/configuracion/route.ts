import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeStoredWompiConfig } from "@/lib/wompi";

export async function GET() {
  try {
    const settings = await prisma.setting.findFirst({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error al obtener configuracion:", error);
    return NextResponse.json(
      { error: "No se pudo obtener la configuracion" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const current = await prisma.setting.findFirst({
      orderBy: {
        id: "asc",
      },
    });

    const data = {
      storeName: String(body.storeName || current?.storeName || "").trim(),
      logoUrl: body.logoUrl ? String(body.logoUrl).trim() : null,
      faviconUrl: body.faviconUrl ? String(body.faviconUrl).trim() : null,
      whatsapp: body.whatsapp ? String(body.whatsapp).trim() : null,
      address: body.address ? String(body.address).trim() : null,
      primaryColor: body.primaryColor ? String(body.primaryColor).trim() : null,
      secondaryColor: body.secondaryColor ? String(body.secondaryColor).trim() : null,
      bannerUrl: body.bannerUrl ? String(body.bannerUrl).trim() : null,
      wompiPublicKey: body.wompiPublicKey ? String(body.wompiPublicKey).trim() : null,
      wompiIntegritySecret: serializeStoredWompiConfig({
        enabled: Boolean(body.wompiEnabled),
        secret: body.wompiIntegritySecret ? String(body.wompiIntegritySecret) : "",
      }),
      testimonial1Name: body.testimonial1Name ? String(body.testimonial1Name).trim() : null,
      testimonial1Role: body.testimonial1Role ? String(body.testimonial1Role).trim() : null,
      testimonial1Comment: body.testimonial1Comment
        ? String(body.testimonial1Comment).trim()
        : null,
      testimonial2Name: body.testimonial2Name ? String(body.testimonial2Name).trim() : null,
      testimonial2Role: body.testimonial2Role ? String(body.testimonial2Role).trim() : null,
      testimonial2Comment: body.testimonial2Comment
        ? String(body.testimonial2Comment).trim()
        : null,
      testimonial3Name: body.testimonial3Name ? String(body.testimonial3Name).trim() : null,
      testimonial3Role: body.testimonial3Role ? String(body.testimonial3Role).trim() : null,
      testimonial3Comment: body.testimonial3Comment
        ? String(body.testimonial3Comment).trim()
        : null,
    };

    if (!data.storeName) {
      return NextResponse.json(
        { error: "El nombre de la tienda es obligatorio" },
        { status: 400 }
      );
    }

    const settings = current
      ? await prisma.setting.update({
          where: { id: current.id },
          data,
        })
      : await prisma.setting.create({
          data,
        });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error al guardar configuracion:", error);
    return NextResponse.json(
      { error: "No se pudo guardar la configuracion" },
      { status: 500 }
    );
  }
}
