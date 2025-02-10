import { ApiProperty } from '@nestjs/swagger';
import { Organization } from '@prisma/client';

export class ResponseOrganizationDto implements Organization {
  @ApiProperty()
  name: string;

  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;
}
