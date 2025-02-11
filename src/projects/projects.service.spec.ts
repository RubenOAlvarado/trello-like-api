import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma/prisma.service';
import { projectsMethodsMock } from '../shared/mocks/projects/methods.mocks';
import { OrganizationsService } from '../organizations/organizations.service';
import { organizationsMock } from '../shared/mocks/organizations/mocks';
import { projectsMocks } from '../shared/mocks/projects/mocks';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockOrganizationsService = {
  findOne: jest.fn().mockResolvedValue(organizationsMock[0]),
};

describe('ProjectsService', () => {
  let service: ProjectsService;
  let prismaService: PrismaService;
  let organizationsService: OrganizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: PrismaService,
          useValue: projectsMethodsMock,
        },
        {
          provide: OrganizationsService,
          useValue: mockOrganizationsService,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    prismaService = module.get<PrismaService>(PrismaService);
    organizationsService =
      module.get<OrganizationsService>(OrganizationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
    expect(organizationsService).toBeDefined();
  });

  describe('create', () => {
    it('should throw BadRequestException if organization is invalid', async () => {
      const organizationId = 999;
      const createProjectDto = { name: 'New Project' };

      mockOrganizationsService.findOne.mockResolvedValueOnce(null);

      await expect(
        service.create(organizationId, createProjectDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all projects for an organization', async () => {
      const spyFindOneOrganization = jest.spyOn(
        organizationsService,
        'findOne',
      );
      const spyFindManyProjects = jest.spyOn(
        prismaService.projects,
        'findMany',
      );
      const organizationId = 1;

      const result = await service.findAll(organizationId);

      expect(spyFindOneOrganization).toHaveBeenCalledWith(organizationId);
      expect(spyFindManyProjects).toHaveBeenCalledWith({
        where: { organizationId },
      });
      expect(result).toEqual(projectsMocks);
    });

    it('should throw NotFoundException if no projects are found', async () => {
      const organizationId = 1;

      jest.spyOn(prismaService.projects, 'findMany').mockResolvedValueOnce([]);

      await expect(service.findAll(organizationId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a project by id', async () => {
      const spyFindOneProject = jest.spyOn(
        prismaService.projects,
        'findUnique',
      );
      const projectId = 1;

      const result = await service.findOne(projectId);

      expect(spyFindOneProject).toHaveBeenCalledWith({
        where: { id: projectId },
      });
      expect(result).toEqual(projectsMocks[0]);
    });

    it('should throw NotFoundException if project is not found', async () => {
      const projectId = 999;

      jest
        .spyOn(prismaService.projects, 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(service.findOne(projectId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const spyFindOneProject = jest.spyOn(
        prismaService.projects,
        'findUnique',
      );
      const spyUpdateProject = jest.spyOn(prismaService.projects, 'update');
      const projectId = 1;
      const updateProjectDto = { name: 'Updated Project' };

      const result = await service.update(projectId, updateProjectDto);

      expect(spyFindOneProject).toHaveBeenCalledWith({
        where: { id: projectId },
      });
      expect(spyUpdateProject).toHaveBeenCalledWith({
        where: { id: projectId },
        data: updateProjectDto,
      });
      expect(result).toEqual(projectsMocks[1]);
    });

    it('should throw NotFoundException if project is not found', async () => {
      const projectId = 999;
      const updateProjectDto = { name: 'Updated Project' };

      jest
        .spyOn(prismaService.projects, 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(service.update(projectId, updateProjectDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a project', async () => {
      const spyFindOneProject = jest.spyOn(
        prismaService.projects,
        'findUnique',
      );
      const spyDeleteProject = jest.spyOn(prismaService.projects, 'delete');
      const projectId = 1;

      const result = await service.remove(projectId);

      expect(spyFindOneProject).toHaveBeenCalledWith({
        where: { id: projectId },
      });
      expect(spyDeleteProject).toHaveBeenCalledWith({
        where: { id: projectId },
      });
      expect(result).toEqual(projectsMocks[1]);
    });

    it('should throw NotFoundException if project is not found', async () => {
      const projectId = 999;

      jest
        .spyOn(prismaService.projects, 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(service.remove(projectId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
