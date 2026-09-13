import { getProductById, formatPrice, getProductsId } from '@/lib/products';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';


export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();
  const { name, price, description, emoji } = product;
  const formattedPrice = formatPrice(price);

  return (
    <div className='flex flex-col gap-4 size-full justify-around items-center'>
      <Link href="/" className='button'>
        Назад в каталог
      </Link>
      <div className='product_item'>
        <p>{emoji}</p>
        <h1>Товар: {name}</h1>
        <p >{formattedPrice}</p>
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
  const product = getProductById(id);

  if (!product) {
    return { title: 'Товар не найден' };
  }

  return {
    title: `${product.name} — IShop`,
    description: product.description,
  };
}

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const result = await getProductsId();
  return result;
}