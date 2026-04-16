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

## Imagenes persistentes en hosting
Si quieres que las imagenes no dependan del release actual del proyecto, configura:

```bash
UPLOAD_DIR="/home/usuario/domains/tu-dominio.com/public_html/uploads"
UPLOAD_PUBLIC_BASE_URL="https://tu-dominio.com/uploads"
```

Con eso, los archivos se guardan en una carpeta estable del hosting y en la base se almacena la URL publica final.

## Siguiente paso recomendado
- conectar autenticacion real
- reemplazar datos mock por Prisma
- crear CRUD real de productos y categorias
- conectar pedidos por WhatsApp
