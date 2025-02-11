import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { ProjectsTasksController } from './projects.tasks.controller';

describe('ProjectsTasksController', () => {
  let controller: ProjectsTasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsTasksController],
      providers: [TasksService],
    }).compile();

    controller = module.get<ProjectsTasksController>(ProjectsTasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
