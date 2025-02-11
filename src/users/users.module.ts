import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { IsEmailUniqueConstraint } from './email-unique.constraint';
import { OrganizationsModule } from '../organizations/organizations.module';
import { UsersOrganizationsController } from './users.organizations.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule, OrganizationsModule],
  controllers: [UsersOrganizationsController, UsersController],
  providers: [UsersService, IsEmailUniqueConstraint, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
