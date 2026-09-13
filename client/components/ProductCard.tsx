import type { Product } from '@/data/products';
import { formatPrice } from '@/lib/products';
import Link from 'next/link';

export default function ProductCard({
  product: { id, name, price, description, emoji }
}: {
  product: Product;
}) {
  const formattedPrice = formatPrice(price);
  
  return (
    <Link href={`/product/${id}`}>
      <article className='product_card_item'>
        {emoji}
        <h2>{name}</h2>
        <p>{formattedPrice}</p>
        <p className='product_description'>{description}</p>
      </article>
    </Link>
  );
}