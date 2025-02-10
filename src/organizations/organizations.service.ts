import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createOrganizationDto: CreateOrganizationDto) {
    return this.prismaService.organization.create({
      data: createOrganizationDto,
    });
  }

  findAll() {
    return this.prismaService.organization.findMany();
  }

  findOne(id: number) {
    return this.prismaService.organization.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    const organization = await this.findOne(id);
    if (!organization) {
      throw new NotFoundException('Organization not found.');
    }
    return this.prismaService.organization.update({
      where: { id: organization.id },
      data: updateOrganizationDto,
    });
  }

  async remove(id: number) {
    const organization = await this.findOne(id);
    if (!organization) {
      throw new NotFoundException('Organization not found.');
    }
    return this.prismaService.organization.delete({
      where: { id: organization.id },
    });
  }
}
