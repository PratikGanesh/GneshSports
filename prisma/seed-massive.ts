import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const adjectives = ["Elite", "Pro", "Titan", "Carbonite", "Apex", "Quantum", "Sonic", "Velocity", "Phantom", "Aero", "Impact", "Supreme", "Extreme", "Core", "Signature"];
const models = ["Series X", "Mark II", "V2", "Pro Max", "Plus", "Ultra", "Lite", "Edition", "Classic", "Premium"];
const colors = ["Red", "Blue", "Black", "White", "Neon Green", "Yellow", "Orange", "Silver", "Gold", "Navy", "Gray", "Pink"];
const brandsAvailable = ["Nivia", "Speedo", "Synco", "Gupta Industries", "Ascis", "Cosco", "Yonex", "Puma", "Nike", "Adidas", "Reebok", "Under Armour"];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateProceduralProduct(catName: string, catSlug: string, catId: string, index: number, catImage: string | null, brandIds: Record<string, string>) {
  const brandName = getRandomElement(brandsAvailable);
  const brandId = brandIds[brandName];
  const adj = getRandomElement(adjectives);
  const mod = getRandomElement(models);
  const color = getRandomElement(colors);
  
  // Format Name: e.g. "Nivia Elite Football Series X"
  const baseName = catName.replace(/equipment|accessories|goods|wears/gi, '').trim();
  const name = `${brandName} ${adj} ${baseName} ${mod} - ${color}`;
  
  // Price: 500 to 18000
  const price = getRandomInt(500, 18000);
  
  // Create a truly unique slug so we don't conflict
  const slugName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const slug = `${slugName}-${catSlug}-${index}-${Date.now()}`;
  
  return {
    name,
    brandId,
    sport: catSlug,
    categoryId: catId,
    price,
    slug,
    imageUrl: catImage, // Inherit category default visual
    sku: `${brandName.substring(0,3).toUpperCase()}-${catSlug.substring(0,3).toUpperCase()}-${getRandomInt(1000, 9999)}`,
    description: `A top-of-the-line ${color} ${catName.toLowerCase()} manufactured by ${brandName}. Features ${adj.toLowerCase()} technology and belongs to the ${mod} lineup.`,
    isFeatured: Math.random() < 0.05 // 5% chance to be featured
  };
}

async function main() {
  console.log('Initiating MASSIVE Seeder Engine...');
  
  // Wipe existing products first so we have a clean slate of exactly 2,000.
  console.log('Wiping existing product database...');
  await prisma.product.deleteMany({});
  
  console.log('Fetching all active categories...');
  const categories = await prisma.category.findMany();
  
  if (categories.length === 0) {
    console.error('No categories found. Run category seeder first.');
    return;
  }
  
  const brandIds: Record<string, string> = {};
  for (const b of brandsAvailable) {
    const slug = b.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const brand = await prisma.brand.upsert({
      where: { name: b },
      update: {},
      create: { name: b, slug }
    });
    brandIds[b] = brand.id;
  }
  
  let totalAdded = 0;
  
  for (const cat of categories) {
    console.log(`Generating 50 items for [${cat.name}]...`);
    
    // We will batch insert using createMany
    const productsToCreate = [];
    for (let i = 0; i < 50; i++) {
      productsToCreate.push(generateProceduralProduct(cat.name, cat.slug, cat.id, i, cat.imageUrl, brandIds));
    }
    
    await prisma.product.createMany({
      data: productsToCreate
    });
    
    totalAdded += 50;
  }
  
  console.log(`\n🎉 MASSIVE SEED COMPLETE! Generated exactly ${totalAdded} unique products!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
