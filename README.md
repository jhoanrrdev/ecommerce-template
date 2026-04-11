# Ecommerce Template

Starter inicial de una plantilla ecommerce pensada para Hostinger básico.

## Stack
- Next.js
- TypeScript
- Tailwind CSS
- Prisma
- MariaDB / MySQL

## Cómo iniciar
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

## Siguiente paso recomendado
- conectar autenticación real
- reemplazar datos mock por Prisma
- crear CRUD real de productos y categorías
- conectar pedidos por WhatsApp
