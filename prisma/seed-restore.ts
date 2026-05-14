import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Restoring Original Products into New Schema...')

  const c1 = await prisma.category.create({ data: { name: 'Football', slug: 'football', imageUrl: '/assets/football-cat.jpg' } })
  const c2 = await prisma.category.create({ data: { name: 'Basketball', slug: 'basketball' } })
  const c3 = await prisma.category.create({ data: { name: 'Swimming', slug: 'swimming' } })
  const c4 = await prisma.category.create({ data: { name: 'Indoor Games', slug: 'indoor' } })
  const c5 = await prisma.category.create({ data: { name: 'Trophies & Awards', slug: 'trophies' } })

  const b1 = await prisma.brand.create({ data: { name: 'Nivia', slug: 'nivia' } })
  const b2 = await prisma.brand.create({ data: { name: 'Speedo', slug: 'speedo' } })
  const b3 = await prisma.brand.create({ data: { name: 'Gupta Industries', slug: 'gupta-industries' } })

  const s1 = await prisma.size.create({ data: { name: 'Size 5' } })
  const s2 = await prisma.size.create({ data: { name: 'S' } })
  const s3 = await prisma.size.create({ data: { name: 'M' } })
  const s4 = await prisma.size.create({ data: { name: 'L' } })
  const s5 = await prisma.size.create({ data: { name: 'XL' } })
  const s6 = await prisma.size.create({ data: { name: '10 inch' } })
  const s7 = await prisma.size.create({ data: { name: '12 inch' } })
  const s8 = await prisma.size.create({ data: { name: '15 inch' } })

  await prisma.product.upsert({
    where: { slug: 'nivia-antrix-football' },
    update: {},
    create: {
      name: 'Nivia Antrix Football',
      sport: 'football',
      price: 1200,
      imageUrl: '/assets/nivia-antrix.jpg',
      slug: 'nivia-antrix-football',
      sku: 'NIV-FB-01',
      isFeatured: true,
      categoryId: c1.id,
      brandId: b1.id,
      sizes: { connect: [{ id: s1.id }] }
    }
  })

  await prisma.product.upsert({
    where: { slug: 'speedo-endurance-aquashort' },
    update: {},
    create: {
      name: 'Speedo Endurance+ Aquashort',
      sport: 'swimming',
      price: 3200,
      imageUrl: '/assets/speedo-aquashort.jpg',
      slug: 'speedo-endurance-aquashort',
      sku: 'SPD-TR-01',
      isFeatured: true,
      categoryId: c3.id,
      brandId: b2.id,
      sizes: { connect: [{ id: s2.id }, { id: s3.id }, { id: s4.id }, { id: s5.id }] }
    }
  })

  await prisma.product.upsert({
    where: { slug: 'elite-wooden-champion-trophy' },
    update: {},
    create: {
      name: 'Elite Wooden Champion Trophy',
      sport: 'trophies',
      price: 1500,
      imageUrl: '/assets/gupta-wooden.jpg',
      slug: 'elite-wooden-champion-trophy',
      sku: 'GU-TR-01',
      isFeatured: true,
      categoryId: c5.id,
      brandId: b3.id,
      sizes: { connect: [{ id: s6.id }, { id: s7.id }, { id: s8.id }] }
    }
  })

  console.log('Restoration finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
