import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { usersMockMethods } from '../shared/mocks/users/methods.mocks';
import { organizationsMock } from '../shared/mocks/organizations/mocks';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { usersMocks } from '../shared/mocks/users/mocks';

const mockOrganizationsService = {
  findOne: jest.fn().mockResolvedValue(organizationsMock[0]),
};

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;
  let organizationsService: OrganizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    organizationsService =
      module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
    expect(organizationsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const organizationId = 1;
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        role: 'USER',
      };

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        createdAt: new Date(),
      };

      const spyFindOneOrg = jest
        .spyOn(organizationsService, 'findOne')
        .mockResolvedValue(organizationsMock[0]);
      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation(async (callback) => {
          return callback(prismaService);
        });
      const spyCreateUser = jest
        .spyOn(prismaService.users, 'create')
        .mockResolvedValue(mockUser);

      const result = await service.create(organizationId, createUserDto);

      expect(result).toEqual(mockUser);
      expect(spyFindOneOrg).toHaveBeenCalledWith(organizationId);
      expect(spyCreateUser).toHaveBeenCalledWith({
        data: {
          email: createUserDto.email,
          userOrganizations: {
            create: {
              organizationId,
              role: createUserDto.role,
            },
          },
        },
      });
    });

    it('should throw BadRequestException if organization is not found', async () => {
      const organizationId = 1;
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        role: 'USER',
      };

      jest.spyOn(organizationsService, 'findOne').mockImplementationOnce(() => {
        throw new BadRequestException();
      });

      await expect(
        service.create(organizationId, createUserDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return users for a given organization', async () => {
      const organizationId = 1;

      const spyFindOneOrg = jest.spyOn(organizationsService, 'findOne');
      const spyFindMany = jest.spyOn(prismaService.users, 'findMany');

      const result = await service.findAll(organizationId);

      expect(result).toEqual(usersMocks);
      expect(spyFindOneOrg).toHaveBeenCalledWith(organizationId);
      expect(spyFindMany).toHaveBeenCalledWith({
        where: {
          userOrganizations: {
            some: {
              organizationId,
            },
          },
        },
      });
    });

    it('should throw NotFoundException if no users are found', async () => {
      const organizationId = 1;

      jest
        .spyOn(organizationsService, 'findOne')
        .mockResolvedValue(organizationsMock[0]);
      jest.spyOn(prismaService.users, 'findMany').mockResolvedValue([]);

      await expect(service.findAll(organizationId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = 1;

      const spyFindUnique = jest.spyOn(prismaService.users, 'findUnique');

      const result = await service.findOne(userId);

      expect(result).toEqual(usersMocks[0]);
      expect(spyFindUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 1;

      jest.spyOn(prismaService.users, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 4;
      const updateUserDto: UpdateUserDto = { email: 'updated@example.com' };

      const spyFindOne = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(usersMocks[3]);
      const spyUsersUpdate = jest.spyOn(prismaService.users, 'update');

      const result = await service.update(userId, updateUserDto);

      expect(result).toEqual(usersMocks[3]);
      expect(spyFindOne).toHaveBeenCalledWith(userId);
      expect(spyUsersUpdate).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateUserDto,
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = { email: 'updated@example.com' };

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const userId = 1;

      const spyFindOne = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(usersMocks[3]);
      const spyDelete = jest.spyOn(prismaService.users, 'delete');

      const result = await service.remove(userId);

      expect(result).toEqual(usersMocks[3]);
      expect(spyFindOne).toHaveBeenCalledWith(userId);
      expect(spyDelete).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 1;

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.remove(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';

      const spyFindUnique = jest
        .spyOn(prismaService.users, 'findUnique')
        .mockResolvedValueOnce(usersMocks[3]);

      const result = await service.findByEmail(email);

      expect(result).toEqual(usersMocks[3]);
      expect(spyFindUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });
});
