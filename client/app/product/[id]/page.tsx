import {getProductById} from '@/lib/helper';
import Link from 'next/link';
import { notFound } from 'next/navigation';


export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
    if (!product) {
    return notFound()
  }

  return (
    <div className='flex size-full justify-around'>
      <Link href="/" className='border'>
        Назад в каталог
      </Link>
      <div>
        <h1>Товар: {product.name}</h1>
        <h2>{product.description}</h2>
      </div>
    </div>
  );
}
