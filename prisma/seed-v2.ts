import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Database V2...')

  // Clean
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.color.deleteMany()
  await prisma.size.deleteMany()

  // Base setup
  const cat = await prisma.category.create({ data: { name: 'Football', slug: 'football' } })
  const brand = await prisma.brand.create({ data: { name: 'Nivia', slug: 'nivia' } })
  const color1 = await prisma.color.create({ data: { name: 'Red', hexCode: '#FF0000' } })
  const color2 = await prisma.color.create({ data: { name: 'White', hexCode: '#FFFFFF' } })
  const size1 = await prisma.size.create({ data: { name: 'Size 5' } })

  // Product
  await prisma.product.create({
    data: {
      name: 'Nivia Antrix Football',
      sport: 'football',
      price: 1200,
      slug: 'nivia-antrix-football',
      sku: 'NIV-FB-01',
      isFeatured: true,
      categoryId: cat.id,
      brandId: brand.id,
      colors: { connect: [{ id: color1.id }, { id: color2.id }] },
      sizes: { connect: [{ id: size1.id }] }
    }
  })

  console.log('Seeding V2 finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
