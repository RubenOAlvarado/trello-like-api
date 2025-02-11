import { Controller, Get, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseTaskDto } from './dto/response-task.dto';

@ApiTags('Tasks')
@Controller('users/:id/tasks')
export class UsersTasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Get all tasks for a user by his ID' })
  @ApiOkResponse({
    description: 'Tasks found successfully',
    type: ResponseTaskDto,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: 'Tasks not found.' })
  @ApiBadRequestResponse({ description: 'Invalid user ID.' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong.' })
  @Get()
  async findAllTasksByUserId(@Param('id') id: string) {
    const task = await this.tasksService.getTasksByUser(+id);
    return task;
  }
}
