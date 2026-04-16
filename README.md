# Ecommerce Template

Starter inicial de una plantilla ecommerce pensada para Hostinger basico.

## Stack
- Next.js
- TypeScript
- Tailwind CSS
- Prisma
- MariaDB / MySQL

## Como iniciar
1. Copia `.env.example` a `.env`
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Genera Prisma Client:
   ```bash
   npx prisma generate
   ```
4. Ejecuta en desarrollo:
   ```bash
   npm run dev
   ```

## Base de datos
Edita `DATABASE_URL` en `.env` con tus credenciales de Hostinger o tu entorno local.

## Imagenes persistentes en Cloudinary
La opcion recomendada es Cloudinary. Configura estas variables:

```bash
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"
CLOUDINARY_FOLDER="ecommerce-template"
```

Con eso, el panel seguira usando `/api/upload`, pero los archivos quedaran guardados en Cloudinary y en la base se almacenara la `secure_url`.

## Alternativa: carpeta persistente en hosting
Si no vas a usar Cloudinary, puedes configurar una carpeta persistente fuera del release:

```bash
UPLOAD_DIR="/home/usuario/domains/tu-dominio.com/public_html/uploads"
UPLOAD_PUBLIC_BASE_URL="https://tu-dominio.com/uploads"
```

Con eso, los archivos se guardan en una carpeta estable del hosting y en la base se almacena la URL publica final.

## Evitar perdida de productos o imagenes
- Los productos se guardan en la base definida por `DATABASE_URL`. Si en un despliegue apuntas a otra base, veras el catalogo vacio aunque el codigo siga funcionando.
- Las imagenes no deben guardarse dentro del release del proyecto en produccion. Usa Cloudinary o define `UPLOAD_DIR` y `UPLOAD_PUBLIC_BASE_URL` para que queden fuera del deploy.
- Desde esta version, la API de subida prioriza Cloudinary y bloquea cargas efimeras en produccion si falta una configuracion persistente.

## Siguiente paso recomendado
- conectar autenticacion real
- reemplazar datos mock por Prisma
- crear CRUD real de productos y categorias
- conectar pedidos por WhatsApp
