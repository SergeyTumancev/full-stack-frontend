import type { Product } from './generated/prisma/client';
import { prisma } from './db';

// 1) Тип, который видит наружу (контракт API)
export type ProductDto = {
  id: string;
  slug: string;
  name: string;
  price: number;      // ← именно number, не Decimal
  description: string;
  emoji: string;
};

function toDto(product: Product): ProductDto {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: Number(product.price),   // ← ключевое: Decimal → number
    description: product.description,
    emoji: product.emoji,
  };
}

// 2) Функция списка
export async function getProducts(): Promise<ProductDto[]> {
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
  });
  return products.map(toDto);
}

// 3) Функция одного товара (или null, если не найден)
export async function getProductBySlug(slug: string): Promise<ProductDto | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
  });
  return product ? toDto(product) : null;
}