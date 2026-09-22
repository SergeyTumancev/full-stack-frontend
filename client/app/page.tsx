import ProductCard from '@/components/ProductCard';
import { getProducts} from '@/lib/products';

export default async function Home() {
  const products = await getProducts();
  
  return (
    <>
      <h1>Каталог</h1>
      <ul className='product_page'>
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </>
  );
}
