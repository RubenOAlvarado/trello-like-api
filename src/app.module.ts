import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [SharedModule, PrismaModule],
})
export class AppModule {}
