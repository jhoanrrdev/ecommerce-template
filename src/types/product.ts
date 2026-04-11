export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  promoPrice?: number | null;
  stock: number;
  sku?: string | null;
  imageUrl?: string | null;
  active: boolean;
  featured: boolean;
  categoryId: number;
};
