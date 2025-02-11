import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    type: String,
    example: 'Create a new project',
    required: true,
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MaxLength(255, { message: 'Title is too long' })
  title: string;

  @ApiPropertyOptional({
    description: 'The description of the task',
    type: String,
    example: 'Create a new project with a description',
    required: false,
  })
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description is too long' })
  description?: string;

  @ApiProperty({
    description: 'The ID of the status of the task',
    type: Number,
    example: 1,
    required: true,
  })
  @IsNotEmpty({ message: 'Status ID is required' })
  @IsNumber({}, { message: 'Status ID must be a number' })
  @IsPositive({ message: 'Status ID must be a positive number' })
  statusId: number;

  @ApiProperty({
    description: 'The ID of the user that created the task',
    type: Number,
    example: 1,
    required: true,
  })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsNumber({}, { message: 'User ID must be a number' })
  @IsPositive({ message: 'User ID must be a positive number' })
  createdById: number;
}
