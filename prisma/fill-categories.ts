import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching all categories...');
  const categories = await prisma.category.findMany();
  
  console.log(`Found ${categories.length} categories. Injecting products...`);
  
  let count = 0;
  for (const cat of categories) {
    // Check if category already has products
    const existing = await prisma.product.findFirst({ where: { categoryId: cat.id } });
    if (!existing) {
      await prisma.product.create({
        data: {
          name: `Premium ${cat.name} Set`,
          brand: {
            connectOrCreate: {
              where: { name: 'Generic Sports Co.' },
              create: { name: 'Generic Sports Co.', slug: 'generic-sports-co' }
            }
          },
          sport: cat.slug,
          category: { connect: { id: cat.id } },
          price: 1500,
          slug: `generic-${cat.slug}-set`,
          imageUrl: cat.imageUrl,
          isFeatured: false,
          sizes: {
            connectOrCreate: {
              where: { name: 'Standard' },
              create: { name: 'Standard' }
            }
          },
          description: `Excellent quality ${cat.name} designed with premium materials. Ensure maximum performance and long-lasting durability.`
        }
      });
      count++;
    }
  }

  console.log(`Successfully added ${count} new products to fill empty categories.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
