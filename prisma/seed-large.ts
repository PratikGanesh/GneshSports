import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const niviaFootballs = [
  { name: 'Nivia Antrix Football', price: 1200, slug: 'nivia-antrix-football', sku: 'NIV-FB-01', isFeatured: true, sport: 'football' },
  { name: 'Nivia Ashtang Football', price: 1800, slug: 'nivia-ashtang-football', sku: 'NIV-FB-02', isFeatured: false, sport: 'football' },
  { name: 'Nivia Shining Star Football', price: 950, slug: 'nivia-shining-star-football', sku: 'NIV-FB-03', isFeatured: true, sport: 'football' },
  { name: 'Nivia Simbolo Football Phase 2', price: 2100, slug: 'nivia-simbolo-football', sku: 'NIV-FB-04', isFeatured: false, sport: 'football' },
  { name: 'Nivia Storm Football', price: 600, slug: 'nivia-storm-football', sku: 'NIV-FB-05', isFeatured: false, sport: 'football' },
  { name: 'Nivia Pro Carbonite Shoes', price: 2499, slug: 'nivia-carbonite-shoes', sku: 'NIV-SH-01', isFeatured: true, sport: 'football' },
  { name: 'Nivia Oslar Stud Shoes', price: 1250, slug: 'nivia-oslar-shoes', sku: 'NIV-SH-02', isFeatured: false, sport: 'football' },
  { name: 'Nivia Orthopedic Shin Guards', price: 350, slug: 'nivia-shin-guards', sku: 'NIV-ACC-01', isFeatured: false, sport: 'football' },
  { name: 'Nivia Classic Goalkeeper Gloves', price: 850, slug: 'nivia-gk-gloves', sku: 'NIV-GLV-01', isFeatured: false, sport: 'football' },
  { name: 'Nivia Training Bibs (Set of 10)', price: 1100, slug: 'nivia-training-bibs', sku: 'NIV-BIB-01', isFeatured: false, sport: 'football' }
];

const niviaBasketballs = [
  { name: 'Nivia Top Grip Basketball', price: 950, slug: 'nivia-topgrip-basketball', sku: 'NIV-BB-01', isFeatured: true, sport: 'basketball' },
  { name: 'Nivia Engraver Basketball', price: 1100, slug: 'nivia-engraver-basketball', sku: 'NIV-BB-02', isFeatured: false, sport: 'basketball' },
  { name: 'Nivia Classic Basketball Size 7', price: 750, slug: 'nivia-classic-basketball', sku: 'NIV-BB-03', isFeatured: false, sport: 'basketball' },
  { name: 'Nivia Pro Touch Basketball', price: 1400, slug: 'nivia-protouch-basketball', sku: 'NIV-BB-04', isFeatured: true, sport: 'basketball' }
];

const niviaVolleyballs = [
  { name: 'Nivia Spot Volley', price: 850, slug: 'nivia-spot-volley', sku: 'NIV-VB-01', isFeatured: false, sport: 'volleyball' },
  { name: 'Nivia Kross World Volleyball', price: 1300, slug: 'nivia-kross-volley', sku: 'NIV-VB-02', isFeatured: true, sport: 'volleyball' },
  { name: 'Nivia Spiker Volleyball', price: 650, slug: 'nivia-spiker-volley', sku: 'NIV-VB-03', isFeatured: false, sport: 'volleyball' },
  { name: 'Nivia Volleyball Net Professional', price: 1200, slug: 'nivia-volley-net', sku: 'NIV-VN-01', isFeatured: false, sport: 'volleyball' }
];

const speedoSwim = [
  { name: 'Speedo Endurance+ Aquashort', price: 3200, slug: 'speedo-endurance-aquashort', sku: 'SPD-TR-01', isFeatured: true, sport: 'swimming' },
  { name: 'Speedo Essential Fit Jammer', price: 2800, slug: 'speedo-essential-jammer', sku: 'SPD-TR-02', isFeatured: false, sport: 'swimming' },
  { name: 'Speedo Boomstar Splice Aquashort', price: 3500, slug: 'speedo-boomstar-aquashort', sku: 'SPD-TR-03', isFeatured: false, sport: 'swimming' },
  { name: 'Speedo Biofuse Goggles', price: 1800, slug: 'speedo-biofuse-goggles', sku: 'SPD-GO-01', isFeatured: true, sport: 'swimming' },
  { name: 'Speedo Fastskin Elite Goggles', price: 4500, slug: 'speedo-fastskin-goggles', sku: 'SPD-GO-02', isFeatured: true, sport: 'swimming' },
  { name: 'Speedo Plain Moulded Silicone Cap', price: 500, slug: 'speedo-silicone-cap', sku: 'SPD-CP-01', isFeatured: false, sport: 'swimming' },
  { name: 'Speedo Long Hair Swim Cap', price: 750, slug: 'speedo-longhair-cap', sku: 'SPD-CP-02', isFeatured: false, sport: 'swimming' }
];

const syncoIndoor = [
  { name: 'Synco Signature Carrom Board', price: 4500, slug: 'synco-signature-carrom', sku: 'SYN-CB-01', isFeatured: true, sport: 'indoor' },
  { name: 'Synco Platinum Series Carrom (3" x 2")', price: 5500, slug: 'synco-platinum-carrom', sku: 'SYN-CB-02', isFeatured: true, sport: 'indoor' },
  { name: 'Synco Champion Series Carrom', price: 4000, slug: 'synco-champion-carrom', sku: 'SYN-CB-03', isFeatured: false, sport: 'indoor' },
  { name: 'Synco Genius Carrom Striker 15gms', price: 450, slug: 'synco-genius-striker', sku: 'SYN-CS-01', isFeatured: false, sport: 'indoor' },
  { name: 'Synco Tournament Carrom Coins', price: 650, slug: 'synco-tournament-coins', sku: 'SYN-CC-01', isFeatured: false, sport: 'indoor' },
  { name: 'Synco Wooden Chess Board Set 12x12', price: 1200, slug: 'synco-wooden-chess', sku: 'SYN-CH-01', isFeatured: true, sport: 'indoor' },
  { name: 'Synco Magnetic Chess Board', price: 800, slug: 'synco-magnetic-chess', sku: 'SYN-CH-02', isFeatured: false, sport: 'indoor' },
  { name: 'Synco Professional Wooden Stumps', price: 950, slug: 'synco-cricket-stumps', sku: 'SYN-CR-01', isFeatured: false, sport: 'indoor' }
];

const guptaTrophies = [
  { name: 'Elite Wooden Champion Trophy', price: 1500, slug: 'gupta-elite-wooden-trophy', sku: 'GUP-TD-01', isFeatured: true, sport: 'trophies' },
  { name: 'Gupta Star Achiever Acrylic Trophy', price: 850, slug: 'gupta-star-acrylic', sku: 'GUP-TA-01', isFeatured: false, sport: 'trophies' },
  { name: 'Gupta Golden Cup 18 Inch', price: 2200, slug: 'gupta-gold-cup-18', sku: 'GUP-TC-01', isFeatured: true, sport: 'trophies' },
  { name: 'Gupta Silver Finish Presentation Cup', price: 1950, slug: 'gupta-silver-cup', sku: 'GUP-TC-02', isFeatured: false, sport: 'trophies' },
  { name: 'Gupta Standard Cricket Memento', price: 450, slug: 'gupta-cricket-memento', sku: 'GUP-TM-01', isFeatured: false, sport: 'trophies' },
  { name: 'Premium Alloy Gold Medal 2.5"', price: 250, slug: 'gupta-premium-gold-medal', sku: 'GUP-MD-01', isFeatured: false, sport: 'trophies' },
  { name: 'Excellence Star Ribbon Medal', price: 150, slug: 'gupta-ribbon-medal', sku: 'GUP-MD-02', isFeatured: false, sport: 'trophies' },
  { name: 'Wooden Premium Plaque 10x8', price: 1100, slug: 'gupta-wooden-plaque', sku: 'GUP-TP-01', isFeatured: false, sport: 'trophies' }
];

async function main() {
  console.log('Clearing old products...');
  await prisma.product.deleteMany({});
  
  console.log('Fetching categories...');
  const catFootball = await prisma.category.findUnique({ where: { slug: 'football' } });
  const catBasketball = await prisma.category.findUnique({ where: { slug: 'basketball' } });
  const catVolleyball = await prisma.category.findUnique({ where: { slug: 'volleyball' } }) || catFootball;
  const catSwimming = await prisma.category.findUnique({ where: { slug: 'swimming' } });
  const catIndoor = await prisma.category.findUnique({ where: { slug: 'indoor' } });
  const catTrophies = await prisma.category.findUnique({ where: { slug: 'trophies' } });

  console.log('Seeding Large Dataset...');

  const insertData = async (items: any[], brand: string, sizes: string, catId: string) => {
    for (const item of items) {
      await prisma.product.create({
        data: {
          ...item,
          brand,
          sizes,
          categoryId: catId,
          imageUrl: `/assets/${item.slug}.jpg`, // Just placeholder paths
          description: `Premium ${brand} sports equipment designed for top-tier athletes. Perfect handling, unmatched durability, and superior material construction. Verified SKU: ${item.sku}.`
        }
      });
    }
  };

  if(!catFootball || !catBasketball || !catSwimming || !catIndoor || !catTrophies) {
    console.log("Ensure categories exist before running! Rerun prisma/seed.ts first.");
    return;
  }

  await insertData(niviaFootballs, 'Nivia', 'Size 5, Size 4', catFootball.id);
  await insertData(niviaBasketballs, 'Nivia', 'Size 7, Size 6', catBasketball.id);
  await insertData(niviaVolleyballs, 'Nivia', 'Standard Size', catVolleyball!.id);
  await insertData(speedoSwim, 'Speedo', 'S, M, L, XL', catSwimming.id);
  await insertData(syncoIndoor, 'Synco', 'Standard', catIndoor.id);
  await insertData(guptaTrophies, 'Gupta Industries', '10 Inch, 12 Inch, 15 Inch', catTrophies.id);

  console.log('Successfully seeded exactly 41 highly detailed authentic products.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
