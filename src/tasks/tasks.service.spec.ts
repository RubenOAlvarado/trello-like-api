import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { usersMocks } from '../shared/mocks/users/mocks';
import { UsersService } from '../users/users.service';
import { tasksMethodsMock } from '../shared/mocks/tasks/methods.mocks';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';
import { projectsMocks } from '../shared/mocks/projects/mocks';
import { CreateTaskDto } from './dto/create-task.dto';
import { tasksMocks } from '../shared/mocks/tasks/mocks';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ChangeStatusDto } from './dto/change-status.dto';

describe('TasksService', () => {
  let service: TasksService;
  let usersService: UsersService;
  let prismaService: PrismaService;
  let projectsService: ProjectsService;

  const mockUsersService = {
    findOne: jest.fn().mockResolvedValue(usersMocks[0]),
  };

  const mockProjectsService = {
    findOne: jest.fn().mockResolvedValue(projectsMocks[0]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<TasksService>(TasksService);
    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    projectsService = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(usersService).toBeDefined();
    expect(prismaService).toBeDefined();
    expect(projectsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const projectId = 1;
      const createTaskDto: CreateTaskDto = {
        title: 'Task 1',
        description: 'Description of Task 1',
        statusId: 1,
        createdById: 1,
      };

      const spyCreate = jest
        .spyOn(prismaService.tasks, 'create')
        .mockResolvedValueOnce(tasksMocks[0]);
      const spyFindOne = jest
        .spyOn(projectsService, 'findOne')
        .mockResolvedValueOnce(projectsMocks[0]);

      const result = await service.create(projectId, createTaskDto);

      expect(result).toEqual(tasksMocks[0]);
      expect(spyFindOne).toHaveBeenCalledWith(projectId);
      expect(spyCreate).toHaveBeenCalledWith({
        data: {
          ...createTaskDto,
          projectId,
        },
      });
    });

    it('should throw BadRequestException if project is not found', async () => {
      const projectId = 1;
      const createTaskDto: CreateTaskDto = {
        title: 'Task 1',
        description: 'Description of Task 1',
        statusId: 1,
        createdById: 1,
      };

      jest.spyOn(projectsService, 'findOne').mockImplementationOnce(() => {
        throw new BadRequestException();
      });

      await expect(service.create(projectId, createTaskDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return tasks for a given project', async () => {
      const projectId = 1;

      const spyFindOne = jest
        .spyOn(projectsService, 'findOne')
        .mockResolvedValueOnce(projectsMocks[0]);
      const spyFindMany = jest
        .spyOn(prismaService.tasks, 'findMany')
        .mockResolvedValue(tasksMocks);

      const result = await service.findAll(projectId);

      expect(result).toEqual(tasksMocks);
      expect(spyFindOne).toHaveBeenCalledWith(projectId);
      expect(spyFindMany).toHaveBeenCalledWith({
        where: {
          projectId,
          isDeleted: false,
        },
      });
    });

    it('should return deleted tasks if isDeleted is true', async () => {
      const projectId = 1;

      const spyFindMany = jest
        .spyOn(prismaService.tasks, 'findMany')
        .mockResolvedValue([tasksMocks[3]]);

      const result = await service.findAll(projectId, true);

      expect(result).toEqual([tasksMocks[3]]);
      expect(spyFindMany).toHaveBeenCalledWith({
        where: {
          projectId,
          isDeleted: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const taskId = 1;

      const spyFindOne = jest
        .spyOn(prismaService.tasks, 'findUnique')
        .mockResolvedValue(tasksMocks[0]);

      const result = await service.findOne(taskId);

      expect(result).toEqual(tasksMocks[0]);
      expect(spyFindOne).toHaveBeenCalledWith({
        where: { id: taskId },
      });
    });

    it('should throw NotFoundException if task is not found', async () => {
      const taskId = 1;

      jest.spyOn(prismaService.tasks, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(taskId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task 1' };

      const spyFindOne = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(tasksMocks[0]);
      const spyUpdate = jest
        .spyOn(prismaService.tasks, 'update')
        .mockResolvedValue(tasksMocks[1]);

      const result = await service.update(taskId, updateTaskDto);

      expect(result).toEqual(tasksMocks[1]);
      expect(spyFindOne).toHaveBeenCalledWith(taskId);
      expect(spyUpdate).toHaveBeenCalledWith({
        where: { id: taskId },
        data: updateTaskDto,
      });
    });

    it('should throw NotFoundException if task is not found', async () => {
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task 1' };

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.update(taskId, updateTaskDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should mark a task as deleted', async () => {
      const taskId = 1;

      const spyFindOne = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(tasksMocks[0]);
      const spyUpdate = jest
        .spyOn(prismaService.tasks, 'update')
        .mockResolvedValue({ ...tasksMocks[0], isDeleted: true });

      const result = await service.remove(taskId);

      expect(result).toEqual({ ...tasksMocks[0], isDeleted: true });
      expect(spyFindOne).toHaveBeenCalledWith(taskId);
      expect(spyUpdate).toHaveBeenCalledWith({
        where: { id: taskId },
        data: { isDeleted: true },
      });
    });

    it('should throw BadRequestException if task is already deleted', async () => {
      const taskId = 1;

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue({ ...tasksMocks[0], isDeleted: true });

      await expect(service.remove(taskId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('changeTaskStatus', () => {
    it('should change the status of a task', async () => {
      const taskId = 1;
      const changeStatusDto: ChangeStatusDto = { statusId: 2 };
      const mockStatus = { id: 2, name: 'In Progress' };

      const spyFindOne = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(tasksMocks[0]);
      const spyFindUnique = jest
        .spyOn(prismaService.taskStatus, 'findUnique')
        .mockResolvedValue(mockStatus);
      const spyUpdate = jest
        .spyOn(prismaService.tasks, 'update')
        .mockResolvedValue({ ...tasksMocks[0], statusId: 2 });

      const result = await service.changeTaskStatus(taskId, changeStatusDto);

      expect(result).toEqual({ ...tasksMocks[0], statusId: 2 });
      expect(spyFindOne).toHaveBeenCalledWith(taskId);
      expect(spyFindUnique).toHaveBeenCalledWith({
        where: { id: changeStatusDto.statusId },
      });
      expect(spyUpdate).toHaveBeenCalledWith({
        where: { id: taskId },
        data: { statusId: 2 },
        include: { status: true },
      });
    });

    it('should throw BadRequestException if task already has the same status', async () => {
      const taskId = 1;
      const changeStatusDto: ChangeStatusDto = { statusId: 1 };
      const mockStatus = { id: 1, name: 'To Do' };

      jest.spyOn(service, 'findOne').mockResolvedValue(tasksMocks[0]);
      jest
        .spyOn(prismaService.taskStatus, 'findUnique')
        .mockResolvedValue(mockStatus);

      await expect(
        service.changeTaskStatus(taskId, changeStatusDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  /* describe('assignTask', () => {
    it('should assign a task to a user', async () => {
      const taskId = 1;
      const userAssignationDto: UserAssignationDto = { userId: 1 };
      const mockTask = { id: taskId };
      const mockUser = { id: 1, email: 'user@example.com' };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockTask);
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
      jest
        .spyOn(prismaService.taskAssignment, 'create')
        .mockResolvedValue({ taskId, userId: 1 });

      const result = await service.assignTask(taskId, userAssignationDto);

      expect(result).toEqual({ taskId, userId: 1 });
      expect(service.findOne).toHaveBeenCalledWith(taskId);
      expect(usersService.findOne).toHaveBeenCalledWith(
        userAssignationDto.userId,
      );
      expect(prismaService.taskAssignment.create).toHaveBeenCalledWith({
        data: {
          taskId: mockTask.id,
          userId: mockUser.id,
        },
      });
    });
  });

  describe('unassignTask', () => {
    it('should unassign a task from a user', async () => {
      const taskId = 1;
      const userAssignationDto: UserAssignationDto = { userId: 1 };
      const mockTask = { id: taskId };
      const mockUser = { id: 1, email: 'user@example.com' };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockTask);
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
      jest
        .spyOn(prismaService.taskAssignment, 'updateMany')
        .mockResolvedValue({ count: 1 });

      const result = await service.unassignTask(taskId, userAssignationDto);

      expect(result).toEqual({ count: 1 });
      expect(service.findOne).toHaveBeenCalledWith(taskId);
      expect(usersService.findOne).toHaveBeenCalledWith(
        userAssignationDto.userId,
      );
      expect(prismaService.taskAssignment.updateMany).toHaveBeenCalledWith({
        where: {
          taskId: mockTask.id,
          userId: mockUser.id,
        },
        data: {
          unassignedAt: expect.any(Date),
          userId: undefined,
        },
      });
    });
  });

  describe('getTasksByUser', () => {
    it('should return tasks assigned to a user', async () => {
      const userId = 1;
      const mockUser = { id: userId, email: 'user@example.com' };
      const mockTasks = [
        { task: { id: 1, title: 'Task 1' } },
        { task: { id: 2, title: 'Task 2' } },
      ];

      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
      jest
        .spyOn(prismaService.taskAssignment, 'findMany')
        .mockResolvedValue(mockTasks);

      const result = await service.getTasksByUser(userId);

      expect(result).toEqual(mockTasks);
      expect(usersService.findOne).toHaveBeenCalledWith(userId);
      expect(prismaService.taskAssignment.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUser.id,
          unassignedAt: null,
        },
        include: {
          task: true,
        },
      });
    });

    it('should throw NotFoundException if no tasks are assigned to the user', async () => {
      const userId = 1;
      const mockUser = { id: userId, email: 'user@example.com' };

      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
      jest
        .spyOn(prismaService.taskAssignment, 'findMany')
        .mockResolvedValue([]);

      await expect(service.getTasksByUser(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  }); */
});
