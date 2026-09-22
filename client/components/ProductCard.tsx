import { formatPrice } from '@/lib/products';
import Link from 'next/link';
import type { Product } from '@/lib/products';

export default function ProductCard({
  product: { id, name, price, description, emoji }
}: {
  product: Product;
}) {
  const formattedPrice = formatPrice(price);
  
  return (
    <Link href={`/product/${id}`}>
      <article className='card'>
        {emoji}
        <h2>{name}</h2>
        <p>{formattedPrice}</p>
        <p className='product_description'>{description}</p>
      </article>
    </Link>
  );
}