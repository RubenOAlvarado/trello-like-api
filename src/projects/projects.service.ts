import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrganizationsService } from 'src/organizations/organizations.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  async create(organizationId: number, createProjectDto: CreateProjectDto) {
    await this.validateOrganization(organizationId);
    return this.prismaService.$transaction(async (prisma) => {
      const newProject = await prisma.projects.create({
        data: {
          name: createProjectDto.name,
          organizationId,
        },
      });

      return newProject;
    });
  }

  async findAll(organizationId: number) {
    await this.validateOrganization(organizationId);
    const projects = await this.prismaService.projects.findMany({
      where: {
        organizationId,
      },
    });
    if (projects.length === 0) {
      throw new NotFoundException('Projects not found.');
    }
    return projects;
  }

  async findOne(id: number) {
    const project = await this.prismaService.projects.findUnique({
      where: {
        id,
      },
    });
    if (!project) {
      throw new NotFoundException('Project not found.');
    }
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const validProject = await this.findOne(id);
    if (!validProject) {
      throw new NotFoundException('Project not found.');
    }
    return this.prismaService.projects.update({
      where: {
        id,
      },
      data: updateProjectDto,
    });
  }

  async remove(id: number) {
    const validProject = await this.findOne(id);
    if (!validProject) {
      throw new NotFoundException('Project not found.');
    }
    return this.prismaService.projects.delete({
      where: {
        id,
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
