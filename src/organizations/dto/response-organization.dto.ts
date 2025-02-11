import { ApiProperty } from '@nestjs/swagger';
import { Organizations } from '@prisma/client';

export class ResponseOrganizationDto implements Organizations {
  @ApiProperty()
  name: string;

  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;
}
