import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Страница не найдена',
};

export default function NotFound() {
  return (
    <div className='flex size-full flex-col gap-4 items-center justify-center p-10'>
      <h1 className='text-4xl font-bold'>404</h1>
      <p>Страница не найдена</p>
      <Link href='/' className='button'>
        Назад в каталог
      </Link>
    </div>
  );
}
