import { notFound } from 'next/navigation';
const API_URL = process.env.API_URL ?? 'http://localhost:4000';

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  emoji: string;
};


type ProductsResponse = {
  data: Product[];
};

type ProductResponse = {
  data: Product;
};

export async function getProductById(id: string) {
  const res = await fetch(`${API_URL}/api/products/${id}`);
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  const { data } = (await res.json()) as ProductResponse;
  return data;
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB'
  }).format(price)
}

export async function getProductIds(): Promise<{ id: string }[]> {
  const products = await getProducts();
  return products.map((product) => ({ id: product.id }));
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/api/products`);
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  const { data } = (await res.json()) as ProductsResponse;
  return data;
}