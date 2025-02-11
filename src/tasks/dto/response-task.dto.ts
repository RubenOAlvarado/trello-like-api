import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Tasks } from '@prisma/client';

export class ResponseTaskDto implements Tasks {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description: string | null;

  @ApiProperty()
  statusId: number;

  @ApiProperty()
  projectId: number;

  @ApiProperty()
  createdById: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  isDeleted: boolean;
}
