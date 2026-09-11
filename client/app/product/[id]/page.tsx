import getProductById from '@/lib/helper';
import { notFound } from 'next/navigation';


export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) {
    return notFound()
  }
  const product = getProductById(id);

  return (
    <div>
      <h1>Товар: {product?.name}</h1>
      <h2>{product?.description}</h2>
    </div>
  );
}
