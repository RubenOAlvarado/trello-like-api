/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.projects.deleteMany();
  await prisma.userOrganization.deleteMany();
  await prisma.users.deleteMany();
  await prisma.organization.deleteMany();

  const organizations = await Promise.all([
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

  const users = await Promise.all([
    prisma.users.create({
      data: {
        email: 'john.doe@example.com',
        createdAt: new Date('2024-01-10'),
      },
    }),
    prisma.users.create({
      data: {
        email: 'jane.smith@example.com',
        createdAt: new Date('2024-01-12'),
      },
    }),
    prisma.users.create({
      data: {
        email: 'bob.wilson@example.com',
        createdAt: new Date('2024-01-25'),
      },
    }),
    prisma.users.create({
      data: {
        email: 'sarah.johnson@example.com',
        createdAt: new Date('2024-02-05'),
      },
    }),
  ]);

  await Promise.all([
    prisma.userOrganization.create({
      data: {
        userId: users[0].id,
        organizationId: organizations[0].id,
        role: 'ADMIN',
      },
    }),
    prisma.userOrganization.create({
      data: {
        userId: users[0].id,
        organizationId: organizations[1].id,
        role: 'MEMBER',
      },
    }),
    prisma.userOrganization.create({
      data: {
        userId: users[1].id,
        organizationId: organizations[1].id,
        role: 'ADMIN',
      },
    }),
    prisma.userOrganization.create({
      data: {
        userId: users[2].id,
        organizationId: organizations[0].id,
        role: 'MEMBER',
      },
    }),
    prisma.userOrganization.create({
      data: {
        userId: users[2].id,
        organizationId: organizations[1].id,
        role: 'MEMBER',
      },
    }),
    prisma.userOrganization.create({
      data: {
        userId: users[2].id,
        organizationId: organizations[2].id,
        role: 'MEMBER',
      },
    }),
    prisma.userOrganization.create({
      data: {
        userId: users[3].id,
        organizationId: organizations[2].id,
        role: 'ADMIN',
      },
    }),
  ]);

  await Promise.all([
    prisma.projects.create({
      data: {
        name: 'AI Research Platform',
        organizationId: organizations[0].id,
        createdAt: new Date('2024-01-16'),
      },
    }),
    prisma.projects.create({
      data: {
        name: 'Cloud Migration Tool',
        organizationId: organizations[0].id,
        createdAt: new Date('2024-01-18'),
      },
    }),

    prisma.projects.create({
      data: {
        name: 'E-commerce Platform',
        organizationId: organizations[1].id,
        createdAt: new Date('2024-01-22'),
      },
    }),
    prisma.projects.create({
      data: {
        name: 'Mobile App Development',
        organizationId: organizations[1].id,
        createdAt: new Date('2024-01-25'),
      },
    }),

    prisma.projects.create({
      data: {
        name: 'Blockchain Integration',
        organizationId: organizations[2].id,
        createdAt: new Date('2024-02-03'),
      },
    }),
    prisma.projects.create({
      data: {
        name: 'IoT Management System',
        organizationId: organizations[2].id,
        createdAt: new Date('2024-02-05'),
      },
    }),
  ]);

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
