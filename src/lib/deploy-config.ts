type UploadConfig = {
  uploadDir: string;
  publicBaseUrl: string;
};

type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  folder: string;
};

function trimEnv(value: string | undefined) {
  return value?.trim() || "";
}

export function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = trimEnv(process.env.CLOUDINARY_CLOUD_NAME);
  const apiKey = trimEnv(process.env.CLOUDINARY_API_KEY);
  const apiSecret = trimEnv(process.env.CLOUDINARY_API_SECRET);

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return {
    cloudName,
    apiKey,
    apiSecret,
    folder: trimEnv(process.env.CLOUDINARY_FOLDER) || "ecommerce-template",
  };
}

export function isPersistentUploadConfigured() {
  return Boolean(
    getCloudinaryConfig() ||
      (trimEnv(process.env.UPLOAD_DIR) && trimEnv(process.env.UPLOAD_PUBLIC_BASE_URL))
  );
}

export function getUploadConfig(defaultUploadDir: string): UploadConfig {
  const customUploadDir = trimEnv(process.env.UPLOAD_DIR);
  const customPublicBaseUrl = trimEnv(process.env.UPLOAD_PUBLIC_BASE_URL);

  if (customUploadDir && customPublicBaseUrl) {
    return {
      uploadDir: customUploadDir,
      publicBaseUrl: customPublicBaseUrl.replace(/\/+$/, ""),
    };
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Faltan UPLOAD_DIR y UPLOAD_PUBLIC_BASE_URL. En produccion no se permiten subidas en la carpeta temporal del despliegue."
    );
  }

  return {
    uploadDir: defaultUploadDir,
    publicBaseUrl: "/uploads",
  };
}

export function getPersistenceWarnings() {
  const warnings: string[] = [];

  if (!isPersistentUploadConfigured()) {
    warnings.push(
      process.env.NODE_ENV === "production"
        ? "Las imagenes no tienen almacenamiento persistente configurado. Define Cloudinary o UPLOAD_DIR y UPLOAD_PUBLIC_BASE_URL para evitar perdidas en despliegues."
        : "En produccion debes definir Cloudinary o UPLOAD_DIR y UPLOAD_PUBLIC_BASE_URL para que las imagenes no se pierdan en despliegues."
    );
  }

  return warnings;
}
