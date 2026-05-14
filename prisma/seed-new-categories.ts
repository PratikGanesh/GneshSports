import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const rawCategories = [
  "Bestseller", "New", "Trending", "Shoes", "Sports Wears", "Cricket Equipment", 
  "Sports Goods", "Outdoor Game Equipment", "Net", "Tennis Equipment", "Gym Equipments", 
  "Boxing Equipment", "Badminton Equipment", "Skipping Ropes", "Football Equipment",
  "Carrom Board", "Music", "Table Tennis Equipment", "Carrom Board Accessories", 
  "Fitness Equipment", "Volleyball Equipment", "Shape Wears", "Medicine Ball", 
  "Discus", "Shotput", "Hammers", "Open Gym", "Other", "Chess Equipment", 
  "Handicraft", "Cap", "Basketball Equipment", "Sports Balls", "Swimming Equipment"
];

// Deduplicated list
const categoriesList = [...new Set(rawCategories)];

function getCategoryImage(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('shoe') || n.includes('wear')) return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800';
    if (n.includes('cricket')) return 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800';
    if (n.includes('tennis') || n.includes('net')) return 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800';
    if (n.includes('gym') || n.includes('fitness') || n.includes('medicine') || n.includes('open gym')) return 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800';
    if (n.includes('boxing')) return 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=800';
    if (n.includes('badminton')) return 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800';
    if (n.includes('football')) return 'https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&q=80&w=800';
    if (n.includes('carrom') || n.includes('board') || n.includes('chess')) return 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=800';
    if (n.includes('volleyball')) return 'https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&q=80&w=800';
    if (n.includes('basketball')) return 'https://images.unsplash.com/photo-1542652694-40abf526446e?auto=format&fit=crop&q=80&w=800';
    if (n.includes('swim')) return 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=800';
    if (n.includes('music')) return 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800';
    if (n.includes('bestseller') || n.includes('trending') || n.includes('new')) return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800';
    
    // Default sports image
    return 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800';
}

function generateSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function main() {
  console.log('Seeding new requested categories...');

  let added = 0;
  for (const catName of categoriesList) {
    const slug = generateSlug(catName);
    const imageUrl = getCategoryImage(catName);

    // Upsert to handle duplicates if run multiple times
    await prisma.category.upsert({
      where: { slug },
      update: {
        imageUrl // update image url if it was missing 
      },
      create: {
        name: catName,
        slug,
        imageUrl
      }
    });
    added++;
  }

  console.log(`Successfully processed ${added} unique categories with mapped Images.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
