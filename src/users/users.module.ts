import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { IsEmailUniqueConstraint } from './email-unique.constraint';
import { OrganizationsModule } from '../organizations/organizations.module';
import { OrganizationsUsersController } from './organizations.users.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaModule, OrganizationsModule],
  controllers: [OrganizationsUsersController, UsersController],
  providers: [UsersService, IsEmailUniqueConstraint, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
