import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    const newOrganization = await this.prismaService.organizations.create({
      data: createOrganizationDto,
    });
    return newOrganization;
  }

  async findAll() {
    const organizations = await this.prismaService.organizations.findMany();
    if (organizations.length === 0) {
      throw new NotFoundException('Organizations not found.');
    }
    return organizations;
  }

  async findOne(id: number) {
    const organization = await this.prismaService.organizations.findUnique({
      where: { id },
    });
    if (!organization) {
      throw new NotFoundException('Organization not found.');
    }
    return organization;
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    const organization = await this.findOne(id);
    if (!organization) {
      throw new NotFoundException('Organization not found.');
    }
    return this.prismaService.organizations.update({
      where: { id: organization.id },
      data: updateOrganizationDto,
    });
  }

  async remove(id: number) {
    const organization = await this.findOne(id);
    if (!organization) {
      throw new NotFoundException('Organization not found.');
    }
    return this.prismaService.organizations.delete({
      where: { id: organization.id },
    });
  }
}
