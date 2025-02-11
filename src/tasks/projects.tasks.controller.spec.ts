import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { ProjectsTasksController } from './projects.tasks.controller';
import { usersMocks } from '../shared/mocks/users/mocks';
import { projectsMocks } from '../shared/mocks/projects/mocks';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';
import { tasksMethodsMock } from '../shared/mocks/tasks/methods.mocks';

describe('ProjectsTasksController', () => {
  let controller: ProjectsTasksController;

  const mockUsersService = {
    findOne: jest.fn().mockResolvedValue(usersMocks[0]),
  };

  const mockProjectsService = {
    findOne: jest.fn().mockResolvedValue(projectsMocks[0]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsTasksController],
      providers: [
        TasksService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: PrismaService,
          useValue: tasksMethodsMock,
        },
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
      ],
    }).compile();

    controller = module.get<ProjectsTasksController>(ProjectsTasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
