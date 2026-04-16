import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";
import { getCloudinaryConfig, getUploadConfig } from "@/lib/deploy-config";

function sanitizeFolder(value: string) {
  return value.replace(/[^a-zA-Z0-9/_-]/g, "").replace(/^\/+|\/+$/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folderValue = formData.get("folder");
    const folder =
      typeof folderValue === "string" && folderValue.trim()
        ? sanitizeFolder(folderValue.trim())
        : "";

    if (!file) {
      return NextResponse.json(
        { error: "No se recibió ningún archivo" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const cloudinaryConfig = getCloudinaryConfig();

    if (cloudinaryConfig) {
      cloudinary.config({
        cloud_name: cloudinaryConfig.cloudName,
        api_key: cloudinaryConfig.apiKey,
        api_secret: cloudinaryConfig.apiSecret,
      });

      const folderParts = [cloudinaryConfig.folder, folder].filter(Boolean);
      const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: folderParts.join("/"),
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result?.secure_url) {
              reject(error || new Error("Cloudinary no devolvio URL publica"));
              return;
            }

            resolve({ secure_url: result.secure_url });
          }
        );

        stream.end(buffer);
      });

      return NextResponse.json({
        ok: true,
        url: result.secure_url,
      });
    }

    const { uploadDir, publicBaseUrl } = getUploadConfig(
      path.join(process.cwd(), "public", "uploads")
    );
    const finalUploadDir = folder ? path.join(uploadDir, folder) : uploadDir;
    const finalPublicBaseUrl = folder ? `${publicBaseUrl}/${folder}` : publicBaseUrl;
    await mkdir(finalUploadDir, { recursive: true });

    const ext = path.extname(file.name) || ".jpg";
    const fileName = `${uuidv4()}${ext}`;
    const filePath = path.join(finalUploadDir, fileName);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      ok: true,
      url: `${finalPublicBaseUrl}/${fileName}`,
    });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "No se pudo subir la imagen",
      },
      { status: 500 }
    );
  }
}
