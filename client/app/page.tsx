import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  return (
    <ul className='product_page'>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard key={product.id} product={product} />
        </li>
      ))}
    </ul>
  );
}
