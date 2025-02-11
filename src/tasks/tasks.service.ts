import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';
import { ChangeStatusDto } from './dto/change-status.dto';
import { UserAssignationDto } from './dto/user-assignation.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService,
  ) {}

  async create(projectId: number, createTaskDto: CreateTaskDto) {
    await this.validateProject(projectId);
    return this.prismaService.tasks.create({
      data: {
        ...createTaskDto,
        projectId,
      },
    });
  }

  async findAll(projectId: number, isDeleted: boolean = false) {
    await this.validateProject(projectId);
    return this.prismaService.tasks.findMany({
      where: {
        projectId,
        isDeleted,
      },
    });
  }

  async findOne(id: number) {
    const task = await this.prismaService.tasks.findUnique({
      where: {
        id,
      },
    });
    if (!task) {
      throw new NotFoundException('Task not found.');
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const validTask = await this.findOne(id);
    return this.prismaService.tasks.update({
      where: {
        id: validTask.id,
      },
      data: {
        ...updateTaskDto,
      },
    });
  }

  async remove(id: number) {
    const validTask = await this.findOne(id);
    if (validTask.isDeleted) {
      throw new BadRequestException('Task already deleted.');
    }
    return this.prismaService.tasks.update({
      where: {
        id: validTask.id,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  async changeTaskStatus(id: number, { statusId }: ChangeStatusDto) {
    const validTask = await this.findOne(id);
    const validStatus = await this.validateStatus(statusId);
    if (validStatus.id === validTask.statusId) {
      throw new BadRequestException('Task already has this status.');
    }
    return this.prismaService.tasks.update({
      where: {
        id: validTask.id,
      },
      data: {
        statusId: validStatus.id,
      },
      include: {
        status: true,
      },
    });
  }

  async assignTask(id: number, { userId }: UserAssignationDto) {
    const validTask = await this.findOne(id);
    const validUser = await this.validateUser(userId);
    return this.prismaService.taskAssignment.create({
      data: {
        taskId: validTask.id,
        userId: validUser.id,
      },
    });
  }

  async unassignTask(id: number, { userId }: UserAssignationDto) {
    const validTask = await this.findOne(id);
    const validUser = await this.validateUser(userId);
    return this.prismaService.taskAssignment.updateMany({
      where: {
        taskId: validTask.id,
        userId: validUser.id,
      },
      data: {
        unassignedAt: new Date(),
        userId: undefined,
      },
    });
  }

  async getTasksByUser(userId: number) {
    const validUser = await this.validateUser(userId);
    const tasksAssigned = await this.prismaService.taskAssignment.findMany({
      where: {
        userId: validUser.id,
        unassignedAt: null,
      },
      include: {
        task: true,
      },
    });
    if (!tasksAssigned.length) {
      throw new NotFoundException(
        `User ${validUser.email} doesn't have any tasks assigned.`,
      );
    }
    return tasksAssigned;
  }

  private async validateProject(projectId: number) {
    const project = await this.projectsService.findOne(projectId);
    if (!project) {
      throw new BadRequestException('Project not found.');
    }
  }

  private async validateStatus(statusId: number) {
    const validStatus = await this.prismaService.taskStatus.findUnique({
      where: {
        id: statusId,
      },
    });
    if (!validStatus) {
      throw new BadRequestException('Invalid status.');
    }
    return validStatus;
  }

  private async validateUser(userId: number) {
    const validUser = await this.usersService.findOne(userId);
    if (!validUser) {
      throw new BadRequestException('User not found.');
    }
    return validUser;
  }
}
