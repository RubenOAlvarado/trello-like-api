import { usersMocks } from './mocks';

export const usersMockMethods = {
  create: jest.fn().mockResolvedValue(usersMocks[0]),
  findMany: jest.fn().mockResolvedValue(usersMocks),
  findUnique: jest.fn().mockResolvedValue(usersMocks[0]),
  update: jest.fn().mockResolvedValue(usersMocks[3]),
  delete: jest.fn().mockResolvedValue(usersMocks[3]),
};
