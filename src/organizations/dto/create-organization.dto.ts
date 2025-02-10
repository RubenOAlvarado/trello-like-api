import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'The name of the organization',
    example: 'NestJS',
    required: true,
  })
  @IsNotEmpty({ message: 'The name is required' })
  @IsString({ message: 'The name must be a string' })
  @MaxLength(255, { message: 'The name is too long' })
  name: string;
}
