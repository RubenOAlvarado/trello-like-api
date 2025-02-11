import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { ResponseOrganizationDto } from '../../organizations/dto/response-organization.dto';

export class ResponseUserDto implements Users {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional()
  organization: ResponseOrganizationDto[];
}
