import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'The name of the project',
    example: 'Project 1',
    required: true,
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(255, { message: 'Name must be less than 255 characters' })
  name: string;
}
