import { products } from '@/data/products';
import ProductRender from '@/lib/ProductRender';

export default function Home() {
  return (
    <div className='product_page'>
      {products.map((product) => (
        <ProductRender key={product.id} product={product} />
      ))}
    </div>
  );
}
