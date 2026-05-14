import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating Admin User...')

  const hashedPassword = await bcrypt.hash('Admin@123', 12);

  await prisma.user.upsert({
    where: { email: 'admin@sportsjam.local' },
    update: {
      password: hashedPassword,
      role: 'admin'
    },
    create: {
      name: 'Admin',
      email: 'admin@sportsjam.local',
      password: hashedPassword,
      role: 'admin'
    }
  });

  console.log('Admin user created successfully:')
  console.log('Email: admin@sportsjam.local')
  console.log('Password: Admin@123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
