import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobalAuth: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobalAuth ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobalAuth = prisma
