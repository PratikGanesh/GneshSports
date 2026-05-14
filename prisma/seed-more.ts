import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const adjectives = ["Elite", "Pro", "Titan", "Carbonite", "Apex", "Quantum", "Sonic", "Velocity", "Phantom", "Aero", "Impact", "Supreme", "Extreme", "Core", "Signature"];
const models = ["Series X", "Mark II", "V2", "Pro Max", "Plus", "Ultra", "Lite", "Edition", "Classic", "Premium"];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElements(arr: any[], count: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function main() {
  console.log('Fetching base data... generating 10 variations per category!');

  const categories = await prisma.category.findMany();
  const brands = await prisma.brand.findMany();
  const sizes = await prisma.size.findMany();
  let colors = await prisma.color.findMany();
  
  if (!colors.length) {
    console.log('No colors found, creating defaults...');
    await prisma.color.createMany({
      data: [
        { name: 'Red', hexCode: '#FF0000' },
        { name: 'Blue', hexCode: '#0000FF' },
        { name: 'Black', hexCode: '#000000' },
        { name: 'White', hexCode: '#FFFFFF' }
      ]
    });
    colors = await prisma.color.findMany();
  }

  if (!categories.length || !brands.length || !colors.length || !sizes.length) {
    console.error("Missing relationships, make sure standard seed is populated.");
    return;
  }

  let totalAdded = 0;

  for (const cat of categories) {
    for (let i = 0; i < 10; i++) {
      const brand = getRandomElements(brands, 1)[0];
      const adj = getRandomElements(adjectives, 1)[0];
      const mod = getRandomElements(models, 1)[0];
      
      const randomColors = getRandomElements(colors, getRandomInt(1, 3));
      const randomSizes = getRandomElements(sizes, getRandomInt(1, 4));

      const name = `${brand.name} ${adj} ${cat.name} ${mod}`;
      const slugName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const slug = `${slugName}-${i}-${Date.now()}`;
      const price = getRandomInt(800, 15000);

      await prisma.product.create({
        data: {
          name,
          sport: cat.slug,
          price,
          slug,
          sku: `${brand.name.substring(0,3).toUpperCase()}-${cat.slug.substring(0,3).toUpperCase()}-${getRandomInt(1000, 9999)}`,
          description: `A top-of-the-line ${cat.name.toLowerCase()} featuring ${adj.toLowerCase()} technology and belongs to the ${mod} lineup.`,
          isFeatured: Math.random() < 0.1,
          
          categoryId: cat.id,
          brandId: brand.id,
          
          colors: { connect: randomColors.map(c => ({ id: c.id })) },
          sizes: { connect: randomSizes.map(s => ({ id: s.id })) }
        }
      });
      totalAdded++;
    }
  }

  console.log(`\n🎉 Seed Complete! Generated ${totalAdded} new dynamic products!`);
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
