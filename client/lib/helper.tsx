import { products } from '@/data/products';

export default function getProductById(id: string) {
  return products.find((product) => product.id == id);
}