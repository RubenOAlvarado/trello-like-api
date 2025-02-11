import { ApiProperty } from '@nestjs/swagger';
import { Projects } from '@prisma/client';

export class ResponseProjectDto implements Projects {
  @ApiProperty()
  name: string;

  @ApiProperty()
  id: number;

  @ApiProperty()
  organizationId: number;

  @ApiProperty()
  createdAt: Date;
}
