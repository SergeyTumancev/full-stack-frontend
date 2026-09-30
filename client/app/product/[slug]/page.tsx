import { getProductBySlug, formatPrice, getProductSlugs } from '@/lib/products';
import Link from 'next/link';
import type { Metadata } from 'next';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const { name, price, description, emoji } = product;
  const formattedPrice = formatPrice(price);

  return (
    <div className='flex flex-col gap-4 size-full justify-around items-center'>
      <Link href='/' className='button'>
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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product.name,
    description: product.description,
  };
}

export async function generateStaticParams() {
  const result = await getProductSlugs();
  return result;
}
