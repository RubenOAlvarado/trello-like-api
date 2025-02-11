import { TestingModule, Test } from '@nestjs/testing';
import { OrganizationsService } from '../organizations/organizations.service';
import { PrismaService } from '../prisma/prisma.service';
import { usersMockMethods } from '../shared/mocks/users/methods.mocks';
import { OrganizationsUsersController } from './organizations.users.controller';
import { UsersService } from './users.service';

const mockOrganizationsService = {
  findOne: jest.fn(),
};

describe('UsersOrganizationsController', () => {
  let controller: OrganizationsUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsUsersController],
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

    controller = module.get<OrganizationsUsersController>(
      OrganizationsUsersController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
