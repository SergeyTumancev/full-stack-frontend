import { products } from '@/data/products';

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB'
  }).format(price)
}

export function getProductsId() {
  return products.map((product) => {return {id: product.id}});
}