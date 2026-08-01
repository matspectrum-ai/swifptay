import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@swiftpay.com.br' },
    update: {},
    create: {
      email: 'demo@swiftpay.com.br',
      name: 'Demo User',
      passwordHash: await bcrypt.hash('demo123456', 12),
      role: 'MERCHANT',
      kycStatus: 'VERIFIED',
    },
  })

  const product = await prisma.product.upsert({
    where: { id: 'demo-product-1' },
    update: {},
    create: {
      id: 'demo-product-1',
      userId: demoUser.id,
      name: 'Produto Demo',
      description: 'Produto de demonstração',
      price: 100,
      category: 'Demo',
      isActive: true,
    },
  })

  console.log({ demoUser: { id: demoUser.id, email: demoUser.email }, product: { id: product.id, name: product.name } })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
