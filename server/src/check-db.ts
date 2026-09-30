import { prisma } from './db';

async function main() {
  const count = await prisma.product.count();
  console.log('товаров в базе:', count);
}

main().finally(() => prisma.$disconnect());
