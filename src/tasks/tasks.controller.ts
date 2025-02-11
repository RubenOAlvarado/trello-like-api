import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseTaskDto } from './dto/response-task.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { UserAssignationDto } from './dto/user-assignation.dto';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Get task by ID' })
  @ApiOkResponse({
    description: 'Task found successfully',
    type: ResponseTaskDto,
  })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const task = await this.tasksService.findOne(+id);
    return task;
  }

  @ApiOperation({ summary: 'Update a task' })
  @ApiOkResponse({
    description: 'Task updated successfully',
    type: ResponseTaskDto,
  })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong.' })
  @ApiBody({ type: UpdateTaskDto, description: 'Task data' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const updatedTask = await this.tasksService.update(+id, updateTaskDto);
    return updatedTask;
  }

  @ApiOperation({ summary: 'Delete a task' })
  @ApiOkResponse({
    description: 'Task deleted successfully',
    type: ResponseTaskDto,
  })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedTask = await this.tasksService.remove(+id);
    return deletedTask;
  }

  @ApiOperation({ summary: 'Update the status of a task' })
  @ApiOkResponse({
    description: 'Task status updated successfully',
    type: ResponseTaskDto,
  })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  @ApiBadRequestResponse({ description: 'Invalid status.' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong.' })
  @ApiBody({ type: ChangeStatusDto, description: 'Task status data' })
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    const updatedTask = await this.tasksService.changeTaskStatus(
      +id,
      changeStatusDto,
    );
    return updatedTask;
  }

  @ApiOperation({ summary: 'Assign a task to a user' })
  @ApiOkResponse({
    description: 'Task assigned successfully',
    type: ResponseTaskDto,
  })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  @ApiBadRequestResponse({ description: 'Invalid user.' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong.' })
  @ApiBody({ type: UserAssignationDto, description: 'User data' })
  @Post(':id/assign')
  async assignTask(
    @Param('id') id: string,
    @Body() assignTaskDto: UserAssignationDto,
  ) {
    const assignedTask = await this.tasksService.assignTask(+id, assignTaskDto);
    return assignedTask;
  }

  @ApiOperation({ summary: 'Unassign a task from a user' })
  @ApiOkResponse({
    description: 'Task unassigned successfully',
    type: ResponseTaskDto,
  })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  @ApiBadRequestResponse({ description: 'Invalid user.' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong.' })
  @ApiBody({ type: UserAssignationDto, description: 'User data' })
  @Delete(':id/assign')
  async unassignTask(
    @Param('id') id: string,
    @Body() assignTaskDto: UserAssignationDto,
  ) {
    const unassignedTask = await this.tasksService.unassignTask(
      +id,
      assignTaskDto,
    );
    return unassignedTask;
  }
}
