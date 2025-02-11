import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { usersMockMethods } from '../shared/mocks/users/methods.mocks';
import { CreateUserDto } from './dto/create-user.dto';
import { usersMocks } from '../shared/mocks/users/mocks';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { organizationsMock } from '../shared/mocks/organizations/mocks';

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
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      role: 'USER',
    };
    const organizationId = 1;

    it('should create a new user successfully', async () => {
      const spyOrganizationFindOne = jest.spyOn(
        organizationsService,
        'findOne',
      );
      const spyPrismaServiceUsersCreate = jest.spyOn(
        prismaService.users,
        'create',
      );

      const result = await service.create(organizationId, createUserDto);

      expect(spyOrganizationFindOne).toHaveBeenCalledWith(organizationId);
      expect(spyPrismaServiceUsersCreate).toHaveBeenCalledWith({
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
      expect(result).toEqual(usersMocks[0]);
    });

    it('should throw BadRequestException if organization not found', async () => {
      mockOrganizationsService.findOne.mockResolvedValue(null);

      await expect(
        service.create(organizationId, createUserDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    const organizationId = 1;

    it('should return all users for an organization', async () => {
      const spyOrganizationFindOne = jest.spyOn(
        organizationsService,
        'findOne',
      );
      const spyPrismaServiceUsersFindMany = jest.spyOn(
        prismaService.users,
        'findMany',
      );

      const result = await service.findAll(organizationId);

      expect(spyPrismaServiceUsersFindMany).toHaveBeenCalledWith({
        where: {
          userOrganizations: {
            some: {
              organizationId,
            },
          },
        },
      });
      expect(spyOrganizationFindOne).toHaveBeenCalledWith(organizationId);
      expect(result).toEqual(usersMocks);
    });

    it('should throw NotFoundException if no users found', async () => {
      (organizationsService.findOne as jest.Mock).mockResolvedValue(null);
      (prismaService.users.findMany as jest.Mock).mockResolvedValue([]);

      await expect(service.findAll(organizationId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if organization not found', async () => {
      mockOrganizationsService.findOne.mockResolvedValue(null);

      await expect(service.findAll(organizationId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const spyPrismaServiceUsersFindUnique = jest.spyOn(
        prismaService.users,
        'findUnique',
      );

      const result = await service.findOne(1);

      expect(spyPrismaServiceUsersFindUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(usersMocks[0]);
    });

    it('should throw NotFoundException if user not found', async () => {
      (prismaService.users.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      email: 'updated@example.com',
    };

    it('should update a user successfully', async () => {
      const updatedUser = { ...usersMocks[3], ...updateUserDto };
      const spyPrismaServiceUsersFindUnique = jest.spyOn(
        prismaService.users,
        'findUnique',
      );
      const spyPrismaServiceUsersUpdate = jest.spyOn(
        prismaService.users,
        'update',
      );

      const result = await service.update(1, updateUserDto);

      expect(spyPrismaServiceUsersUpdate).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateUserDto,
      });
      expect(spyPrismaServiceUsersFindUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      (prismaService.users.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update(1, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a user successfully', async () => {
      const spyPrismaServiceUsersFindUnique = jest.spyOn(
        prismaService.users,
        'findUnique',
      );
      const spyPrismaServiceUsersDelete = jest.spyOn(
        prismaService.users,
        'delete',
      );

      const result = await service.remove(1);

      expect(spyPrismaServiceUsersFindUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(spyPrismaServiceUsersDelete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(usersMocks[3]);
    });

    it('should throw NotFoundException if user not found', async () => {
      (prismaService.users.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found by email', async () => {
      const spyPrismaServiceUsersFindUnique = jest.spyOn(
        prismaService.users,
        'findUnique',
      );

      const result = await service.findByEmail('john.doe@example.com');

      expect(spyPrismaServiceUsersFindUnique).toHaveBeenCalledWith({
        where: { email: 'john.doe@example.com' },
      });
      expect(result).toEqual(usersMocks[0]);
    });

    it('should return null if user not found by email', async () => {
      (prismaService.users.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });
});
