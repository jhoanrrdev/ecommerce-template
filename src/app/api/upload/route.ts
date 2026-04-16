import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

function getUploadConfig() {
  const customUploadDir = process.env.UPLOAD_DIR?.trim();
  const customPublicBaseUrl = process.env.UPLOAD_PUBLIC_BASE_URL?.trim();

  if (customUploadDir && customPublicBaseUrl) {
    return {
      uploadDir: customUploadDir,
      publicBaseUrl: customPublicBaseUrl.replace(/\/+$/, ""),
    };
  }

  return {
    uploadDir: path.join(process.cwd(), "public", "uploads"),
    publicBaseUrl: "/uploads",
  };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No se recibió ningún archivo" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { uploadDir, publicBaseUrl } = getUploadConfig();
    await mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name) || ".jpg";
    const fileName = `${uuidv4()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      ok: true,
      url: `${publicBaseUrl}/${fileName}`,
    });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    return NextResponse.json(
      { error: "No se pudo subir la imagen" },
      { status: 500 }
    );
  }
}
