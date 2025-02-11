import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  async create(organizationId: number, createUserDto: CreateUserDto) {
    await this.validateOrganization(organizationId);
    return this.prismaService.$transaction(async (prisma) => {
      const newUser = await prisma.users.create({
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

      return newUser;
    });
  }

  async findAll(organizationId: number) {
    await this.validateOrganization(organizationId);
    const users = await this.prismaService.users.findMany({
      where: {
        userOrganizations: {
          some: {
            organizationId,
          },
        },
      },
    });
    if (users.length === 0) {
      throw new NotFoundException('Users not found.');
    }
    return users;
  }

  async findOne(id: number) {
    const user = await this.prismaService.users.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const validUser = await this.findOne(id);
    if (!validUser) {
      throw new NotFoundException('User not found.');
    }
    return this.prismaService.users.update({
      where: {
        id: validUser.id,
      },
      data: {
        ...updateUserDto,
      },
    });
  }

  async remove(id: number) {
    const validUser = await this.findOne(id);
    if (!validUser) {
      throw new NotFoundException('User not found.');
    }
    return this.prismaService.users.delete({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prismaService.users.findUnique({
      where: {
        email,
      },
    });
  }

  private async validateOrganization(organizationId: number) {
    const validOrganization =
      await this.organizationsService.findOne(organizationId);
    if (!validOrganization) {
      throw new BadRequestException('Organization not found.');
    }
  }
}
