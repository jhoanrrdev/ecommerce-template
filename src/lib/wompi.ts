import { createHash } from "crypto";

export const WOMPI_CURRENCY = "COP";

export function wompiBaseUrl(publicKey: string) {
  return publicKey.startsWith("pub_test_")
    ? "https://sandbox.wompi.co/v1"
    : "https://production.wompi.co/v1";
}

export function wompiCheckoutUrl() {
  return "https://checkout.wompi.co/p/";
}

export function buildWompiIntegritySignature(params: {
  reference: string;
  amountInCents: number;
  currency?: string;
  integritySecret: string;
  expirationTime?: string;
}) {
  const currency = params.currency || WOMPI_CURRENCY;
  const raw = `${params.reference}${params.amountInCents}${currency}${params.expirationTime || ""}${params.integritySecret}`;
  return createHash("sha256").update(raw).digest("hex");
}

export function wompiReferenceFromOrder(orderId: number) {
  return `WOMPI-ORDER-${orderId}-${Date.now()}`;
}

export function appendWompiMetadata(notes: string | null | undefined, metadata: Record<string, string>) {
  const metadataLines = Object.entries(metadata).map(([key, value]) => `[${key}:${value}]`);
  return [notes?.trim() || "", ...metadataLines].filter(Boolean).join("\n");
}

export function mapWompiStatusToOrderStatus(status: string) {
  switch (status) {
    case "APPROVED":
      return "confirmado";
    case "DECLINED":
    case "VOIDED":
    case "ERROR":
      return "cancelado";
    default:
      return "pendiente";
  }
}
