export const tasksMethodsMock = {
  $transaction: jest.fn(),
  tasks: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  taskStatus: {
    findUnique: jest.fn(),
  },
  taskAssignment: {
    updateMany: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
  },
};
