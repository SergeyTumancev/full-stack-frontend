import { getProductById, formatPrice, getProductIds } from '@/lib/products';
import Link from 'next/link';
import type { Metadata } from 'next';


export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  const { name, price, description, emoji } = product;
  const formattedPrice = formatPrice(price);

  return (
    <div className='flex flex-col gap-4 size-full justify-around items-center'>
      <Link href="/" className='button'>
        Назад в каталог
      </Link>
      <div className='card'>
        <p>{emoji}</p>
        <h1>Товар: {name}</h1>
        <p>{formattedPrice}</p>
        <p className='product_description'>{description}</p>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  return {
    title: product.name,
    description: product.description,
  };
}

export async function generateStaticParams() {
  const result = await getProductIds();
  return result;
}