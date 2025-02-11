import { Controller, Get, Body, Param, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { ResponseTaskDto } from './dto/response-task.dto';

@ApiTags('Tasks')
@Controller('/projects/:id/tasks')
export class ProjectsTasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create a task for a project' })
  @ApiCreatedResponse({
    description: 'Task created successfully',
    type: ResponseTaskDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid project.' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong.' })
  @ApiBody({ type: CreateTaskDto, description: 'Task data' })
  @Post()
  async create(@Param('id') id: string, @Body() createTaskDto: CreateTaskDto) {
    const newTask = await this.tasksService.create(+id, createTaskDto);
    return newTask;
  }

  @ApiOperation({ summary: 'Get all tasks for a project' })
  @ApiCreatedResponse({
    description: 'Tasks found successfully',
    type: ResponseTaskDto,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Invalid project.' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong.' })
  @ApiQuery({
    name: 'isDeleted',
    required: false,
    description: 'Filter tasks by deleted status',
    type: Boolean,
  })
  @Get()
  async findAll(
    @Param('id') id: string,
    @Query('isDeleted') isDeleted?: boolean,
  ) {
    const projectTasks = await this.tasksService.findAll(+id, isDeleted);
    return projectTasks;
  }
}
