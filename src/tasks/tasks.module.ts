import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';
import { ProjectsTasksController } from './projects.tasks.controller';
import { UsersTasksController } from './users.tasks.controller';

@Module({
  imports: [PrismaModule, ProjectsModule, UsersModule],
  controllers: [ProjectsTasksController, TasksController, UsersTasksController],
  providers: [TasksService],
})
export class TasksModule {}
