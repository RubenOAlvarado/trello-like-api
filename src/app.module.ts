import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [SharedModule, PrismaModule, OrganizationsModule, UsersModule],
})
export class AppModule {}
