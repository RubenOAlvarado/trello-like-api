import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationsModule } from './organizations/organizations.module';

@Module({
  imports: [SharedModule, PrismaModule, OrganizationsModule],
})
export class AppModule {}
