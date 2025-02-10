/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.organization.deleteMany({});

  await Promise.all([
    prisma.organization.create({
      data: {
        name: 'Tech Innovators Inc.',
        createdAt: new Date('2024-01-15'),
      },
    }),
    prisma.organization.create({
      data: {
        name: 'Digital Solutions LLC',
        createdAt: new Date('2024-01-20'),
      },
    }),
    prisma.organization.create({
      data: {
        name: 'Future Systems Corp',
        createdAt: new Date('2024-02-01'),
      },
    }),
  ]);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
