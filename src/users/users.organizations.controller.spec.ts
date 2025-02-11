import { TestingModule, Test } from '@nestjs/testing';
import { OrganizationsService } from '../organizations/organizations.service';
import { PrismaService } from '../prisma/prisma.service';
import { usersMockMethods } from '../shared/mocks/users/methods.mocks';
import { UsersController } from './users.controller';
import { UsersOrganizationsController } from './users.organizations.controller';
import { UsersService } from './users.service';

const mockOrganizationsService = {
  findOne: jest.fn(),
};

describe('UsersOrganizationsController', () => {
  let controller: UsersOrganizationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: OrganizationsService,
          useValue: mockOrganizationsService,
        },
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            users: usersMockMethods,
          },
        },
      ],
    }).compile();

    controller = module.get<UsersOrganizationsController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
