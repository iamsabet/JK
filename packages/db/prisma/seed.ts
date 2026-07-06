import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding...')
  // Prisma seed would go here when using real DB
  console.log('Seed complete (no-op for mock mode)')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
