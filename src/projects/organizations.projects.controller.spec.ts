import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma/prisma.service';
import { projectsMethodsMock } from '../shared/mocks/projects/methods.mocks';
import { OrganizationsService } from '../organizations/organizations.service';
import { organizationsMock } from '../shared/mocks/organizations/mocks';

const mockOrganizationsService = {
  findOne: jest.fn().mockResolvedValue(organizationsMock[0]),
};

describe('ProjectsController', () => {
  let controller: ProjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
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

    controller = module.get<ProjectsController>(ProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
