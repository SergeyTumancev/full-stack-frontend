import { getProductById, formatted } from '@/lib/products';
import Link from 'next/link';
import { notFound } from 'next/navigation';


export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();
  const { name, price, description, emoji } = product;
  const formattedPrice = formatted(price);

  return (
    <div className='flex size-full justify-around items-center'>
      <Link href="/" className='border'>
        Назад в каталог
      </Link>
      <div className='product_item'>
        <h1>Товар: {name}</h1>
        <p>{description}</p>
        <p>{product.description}</p>
        <p>{formattedPrice}</p>
        <p>{emoji}</p>
      </div>
    </div>
  );
}
