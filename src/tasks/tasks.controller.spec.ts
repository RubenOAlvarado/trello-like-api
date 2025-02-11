import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { tasksMethodsMock } from '../shared/mocks/tasks/methods.mocks';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { usersMocks } from '../shared/mocks/users/mocks';
import { projectsMocks } from '../shared/mocks/projects/mocks';

describe('TasksController', () => {
  let controller: TasksController;

  const mockUsersService = {
    findOne: jest.fn().mockResolvedValue(usersMocks[0]),
  };

  const mockProjectsService = {
    findOne: jest.fn().mockResolvedValue(projectsMocks[0]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
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

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
