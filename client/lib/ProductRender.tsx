import type { Product } from '@/data/products';

export default function ProductRender({
  product: { id, name, price, description, emoji }
}: {
  product: Product;
}) {
  return (
    <div className='product_item'>
      {emoji}
        <h3>{name}</h3>
        <p>{price} руб</p>
      <p className='product_description'>{description}</p>
    </div>
  );
}