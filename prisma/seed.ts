/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data in reverse order of dependencies
  await prisma.taskAssignment.deleteMany();
  await prisma.tasks.deleteMany();
  await prisma.taskStatus.deleteMany();
  await prisma.projects.deleteMany();
  await prisma.userOrganization.deleteMany();
  await prisma.users.deleteMany();
  await prisma.organizations.deleteMany();

  // Create task statuses
  const taskStatuses = await Promise.all([
    prisma.taskStatus.create({
      data: { name: 'To Do' },
    }),
    prisma.taskStatus.create({
      data: { name: 'In Progress' },
    }),
    prisma.taskStatus.create({
      data: { name: 'Done' },
    }),
  ]);

  const organizations = await Promise.all([
    prisma.organizations.create({
      data: {
        name: 'Tech Innovators Inc.',
        createdAt: new Date('2024-01-15'),
      },
    }),
    prisma.organizations.create({
      data: {
        name: 'Digital Solutions LLC',
        createdAt: new Date('2024-01-20'),
      },
    }),
    prisma.organizations.create({
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

  const projects = await Promise.all([
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

  // Create tasks
  const tasks = await Promise.all([
    // Tasks for AI Research Platform
    prisma.tasks.create({
      data: {
        title: 'Design ML Architecture',
        description:
          'Design the core machine learning architecture for the platform',
        statusId: taskStatuses[0].id,
        projectId: projects[0].id,
        createdById: users[0].id,
        createdAt: new Date('2024-01-17'),
        updatedAt: new Date('2024-01-17'),
      },
    }),
    prisma.tasks.create({
      data: {
        title: 'Implement Data Pipeline',
        description: 'Create data ingestion and processing pipeline',
        statusId: taskStatuses[1].id,
        projectId: projects[0].id,
        createdById: users[1].id,
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18'),
      },
    }),
    // Tasks for E-commerce Platform
    prisma.tasks.create({
      data: {
        title: 'Setup Payment Gateway',
        description: 'Integrate payment processing system',
        statusId: taskStatuses[2].id,
        projectId: projects[2].id,
        createdById: users[1].id,
        createdAt: new Date('2024-01-23'),
        updatedAt: new Date('2024-01-25'),
      },
    }),
    // Tasks for Blockchain Integration
    prisma.tasks.create({
      data: {
        title: 'Smart Contract Development',
        description: 'Develop and test smart contracts',
        statusId: taskStatuses[1].id,
        projectId: projects[4].id,
        createdById: users[3].id,
        createdAt: new Date('2024-02-04'),
        updatedAt: new Date('2024-02-04'),
      },
    }),
  ]);

  // Create task assignments
  await Promise.all([
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[0].id,
        userId: users[0].id,
        assignedAt: new Date('2024-01-17'),
      },
    }),
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[1].id,
        userId: users[1].id,
        assignedAt: new Date('2024-01-18'),
      },
    }),
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[2].id,
        userId: users[2].id,
        assignedAt: new Date('2024-01-23'),
        unassignedAt: new Date('2024-01-25'),
      },
    }),
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[3].id,
        userId: users[3].id,
        assignedAt: new Date('2024-02-04'),
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
