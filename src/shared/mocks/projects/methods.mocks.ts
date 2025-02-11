import { projectsMocks } from './mocks';

export const projectsMethodsMock = {
  $transaction: jest.fn(),
  projects: {
    create: jest.fn().mockResolvedValue(projectsMocks[0]),
    findMany: jest.fn().mockResolvedValue(projectsMocks),
    findUnique: jest.fn().mockResolvedValue(projectsMocks[0]),
    update: jest.fn().mockResolvedValue(projectsMocks[1]),
    delete: jest.fn().mockResolvedValue(projectsMocks[1]),
  },
};
