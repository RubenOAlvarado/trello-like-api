import { organizationsMock } from './mocks';

export const organizationsMethodsMock = {
  create: jest.fn().mockResolvedValue(organizationsMock[0]),
  findMany: jest.fn().mockResolvedValue(organizationsMock),
  findUnique: jest.fn().mockResolvedValue(organizationsMock[0]),
  update: jest.fn().mockResolvedValue(organizationsMock[3]),
  delete: jest.fn().mockResolvedValue(organizationsMock[3]),
};
