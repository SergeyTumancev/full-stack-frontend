import type { Product } from '@/data/products';
import Link from 'next/link';

export default function ProductCard({
  product: { id, name, price, description, emoji }
}: {
  product: Product;
}) {
  const formatted = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB'
}).format(price);
  
  return (
    <Link href={`/product/${id}`}>
      <article className='product_item'>
        {emoji}
          <h2>{name}</h2>
          <p>{formatted}</p>
        <p className='product_description'>{description}</p>
      </article>
    </Link>
  );
}