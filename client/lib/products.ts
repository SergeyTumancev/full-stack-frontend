import { products } from '@/data/products';

export async function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB'
  }).format(price)
}

export async function getProductIds(): Promise<{ id: string }[]> {
  return products.map((product) => ({ id: product.id }));
}
