import type { Product } from '@/data/products';

export default function ProductCard({
  product: { name, price, description, emoji }
}: {
  product: Product;
}) {
  const formatted = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB'
}).format(price);
  
  return (
    <article className='product_item'>
      {emoji}
        <h2>{name}</h2>
        <p>{formatted}</p>
      <p className='product_description'>{description}</p>
    </article>
  );
}