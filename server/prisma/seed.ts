import { prisma } from '../src/db';
import { products } from './seed-data';

async function main() {
  for (const product of products) {
    const { slug, name, price, description, emoji } = product;

    await prisma.product.upsert({
      where: { slug },
      update: { name, price, description, emoji },
      create: { slug, name, price, description, emoji },
    });
  }

  console.log(`Засеяно товаров: ${products.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
