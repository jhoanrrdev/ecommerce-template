import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  appendWompiMetadata,
  buildWompiIntegritySignature,
  parseStoredWompiConfig,
  wompiEnvironmentFromIntegritySecret,
  wompiEnvironmentFromPublicKey,
  wompiCheckoutUrl,
  wompiReferenceFromOrder,
} from "@/lib/wompi";

type CheckoutItemInput = {
  id: number;
  quantity: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const customerName = String(body.customer?.name || "").trim();
    const customerPhone = String(body.customer?.phone || "").trim();
    const customerEmail = body.customer?.email ? String(body.customer.email).trim() : null;
    const customerCity = String(body.customer?.city || "").trim();
    const customerAddress = body.customer?.address ? String(body.customer.address).trim() : "";
    const customerNotes = body.customer?.notes ? String(body.customer.notes).trim() : "";
    const items = Array.isArray(body.items) ? (body.items as CheckoutItemInput[]) : [];

    if (!customerName || !customerPhone || !customerCity) {
      return NextResponse.json(
        { error: "Nombre, telefono y ciudad son obligatorios" },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        { error: "El carrito no tiene productos" },
        { status: 400 }
      );
    }

    const settings = await prisma.setting.findFirst({
      orderBy: {
        id: "asc",
      },
      select: {
        wompiPublicKey: true,
        wompiIntegritySecret: true,
      },
    });

    const publicKey = settings?.wompiPublicKey || "";
    const wompiConfig = parseStoredWompiConfig(settings?.wompiIntegritySecret);
    const integritySecret = wompiConfig.secret;

    if (!publicKey || !integritySecret || !wompiConfig.enabled) {
      return NextResponse.json(
        { error: "Wompi no esta configurado en la tienda" },
        { status: 500 }
      );
    }

    const publicKeyEnvironment = wompiEnvironmentFromPublicKey(publicKey);
    const integrityEnvironment = wompiEnvironmentFromIntegritySecret(integritySecret);

    if (publicKeyEnvironment !== integrityEnvironment) {
      console.error("Wompi config invalida: ambientes mezclados", {
        publicKeyEnvironment,
        integrityEnvironment,
      });
      return NextResponse.json(
        {
          error:
            "Las llaves de Wompi no coinciden entre si. Revisa que la llave publica y el secreto de integridad sean del mismo ambiente.",
        },
        { status: 500 }
      );
    }

    const productIds = items.map((item) => Number(item.id)).filter((id) => !Number.isNaN(id));
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
        active: true,
      },
    });

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: "Uno o mas productos del carrito ya no estan disponibles" },
        { status: 400 }
      );
    }

    const productMap = new Map(products.map((product) => [product.id, product]));
    const normalizedItems = items.map((item) => {
      const product = productMap.get(Number(item.id));

      if (!product) {
        throw new Error("Producto no encontrado");
      }

      return {
        product,
        quantity: Math.max(1, Number(item.quantity) || 1),
        unitPrice: product.promoPrice ?? product.price,
      };
    });

    const total = normalizedItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    const baseNotes = [
      customerCity ? `Ciudad: ${customerCity}` : "",
      customerAddress ? `Direccion: ${customerAddress}` : "",
      customerNotes ? `Notas: ${customerNotes}` : "",
      "Metodo de pago: Wompi",
    ]
      .filter(Boolean)
      .join("\n");

    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        customerEmail,
        total,
        status: "pendiente",
        notes: baseNotes || null,
        items: {
          create: normalizedItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.unitPrice,
          })),
        },
      },
    });

    const reference = wompiReferenceFromOrder(order.id);
    await prisma.order.update({
      where: { id: order.id },
      data: {
        notes: appendWompiMetadata(baseNotes, {
          customer_city: customerCity,
          customer_address: customerAddress,
          customer_notes: customerNotes,
          payment_method: "wompi",
          payment_channel: "checkout",
          wompi_reference: reference,
        }),
      },
    });

    const amountInCents = Math.round(total * 100);
    const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    const redirectBaseUrl = configuredSiteUrl || req.url;
    const redirectUrl = new URL("/pagos/wompi", redirectBaseUrl);

    if (process.env.NODE_ENV === "production" && redirectUrl.protocol !== "https:") {
      console.error("Wompi redirect-url invalida en produccion", {
        redirectUrl: redirectUrl.toString(),
      });
      return NextResponse.json(
        {
          error:
            "La URL de retorno de Wompi no esta en HTTPS. Configura NEXT_PUBLIC_SITE_URL con tu dominio publico.",
        },
        { status: 500 }
      );
    }

    const requestHost = new URL(req.url).host;
    if (configuredSiteUrl) {
      const configuredHost = new URL(configuredSiteUrl).host;
      if (configuredHost !== requestHost) {
        console.warn("Wompi usando dominio configurado distinto al request actual", {
          configuredHost,
          requestHost,
        });
      }
    }

    const signature = buildWompiIntegritySignature({
      reference,
      amountInCents,
      integritySecret,
    });

    console.info("Wompi checkout payload listo", {
      environment: publicKeyEnvironment,
      amountInCents,
      reference,
      redirectUrl: redirectUrl.toString(),
      requestHost,
      configuredSiteUrl: configuredSiteUrl || null,
    });

    return NextResponse.json({
      checkoutUrl: wompiCheckoutUrl(),
      fields: {
        "public-key": publicKey,
        currency: "COP",
        "amount-in-cents": String(amountInCents),
        reference,
        "signature:integrity": signature,
        "redirect-url": redirectUrl.toString(),
        "customer-data:email": customerEmail || "",
        "customer-data:full-name": customerName,
        "customer-data:phone-number": customerPhone.replace(/\D/g, ""),
        "customer-data:phone-number-prefix": "+57",
      },
    });
  } catch (error) {
    console.error("Error creando checkout Wompi:", error);
    return NextResponse.json(
      { error: "No se pudo iniciar el pago con Wompi" },
      { status: 500 }
    );
  }
}
