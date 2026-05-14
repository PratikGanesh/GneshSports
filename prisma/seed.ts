import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Database...')

  const c1 = await prisma.category.upsert({
    where: { slug: 'football' },
    update: {},
    create: {
      name: 'Football',
      slug: 'football',
      imageUrl: '/assets/football-cat.jpg',
    },
  })
  const c2 = await prisma.category.upsert({
    where: { slug: 'basketball' },
    update: {},
    create: { name: 'Basketball', slug: 'basketball' },
  })
  const c3 = await prisma.category.upsert({
    where: { slug: 'swimming' },
    update: {},
    create: { name: 'Swimming', slug: 'swimming' },
  })
  const c4 = await prisma.category.upsert({
    where: { slug: 'indoor' },
    update: {},
    create: { name: 'Indoor Games', slug: 'indoor' },
  })
  const c5 = await prisma.category.upsert({
    where: { slug: 'trophies' },
    update: {},
    create: { name: 'Trophies & Awards', slug: 'trophies' },
  })
  
  await prisma.product.upsert({
    where: { slug: 'nivia-antrix-football' },
    update: {},
    create: {
      name: 'Nivia Antrix Football',
      brand: {
        connectOrCreate: { where: { name: 'Nivia' }, create: { name: 'Nivia', slug: 'nivia' } }
      },
      sport: 'football',
      price: 1200,
      imageUrl: '/assets/nivia-antrix.jpg',
      slug: 'nivia-antrix-football',
      sizes: {
        connectOrCreate: { where: { name: 'Size 5' }, create: { name: 'Size 5' } }
      },
      sku: 'NIV-FB-01',
      isFeatured: true,
      category: { connect: { id: c1.id } },
    }
  })

  await prisma.product.upsert({
    where: { slug: 'speedo-endurance-aquashort' },
    update: {},
    create: {
      name: 'Speedo Endurance+ Aquashort',
      brand: {
        connectOrCreate: { where: { name: 'Speedo' }, create: { name: 'Speedo', slug: 'speedo' } }
      },
      sport: 'swimming',
      price: 3200,
      imageUrl: '/assets/speedo-aquashort.jpg',
      slug: 'speedo-endurance-aquashort',
      sizes: {
        connectOrCreate: { where: { name: 'S, M, L, XL' }, create: { name: 'S, M, L, XL' } }
      },
      sku: 'SPD-TR-01',
      isFeatured: true,
      category: { connect: { id: c3.id } },
    }
  })

  await prisma.product.upsert({
    where: { slug: 'elite-wooden-champion-trophy' },
    update: {},
    create: {
      name: 'Elite Wooden Champion Trophy',
      brand: {
        connectOrCreate: { where: { name: 'Gupta Industries' }, create: { name: 'Gupta Industries', slug: 'gupta-industries' } }
      },
      sport: 'trophies',
      price: 1500,
      imageUrl: '/assets/gupta-wooden.jpg',
      slug: 'elite-wooden-champion-trophy',
      sizes: {
        connectOrCreate: { where: { name: '10 inch, 12 inch, 15 inch' }, create: { name: '10 inch, 12 inch, 15 inch' } }
      },
      sku: 'GU-TR-01',
      isFeatured: true,
      category: { connect: { id: c5.id } },
    }
  })

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
