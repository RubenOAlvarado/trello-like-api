import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UserAssignationDto {
  @ApiProperty({
    description: 'The ID of the user to assign the task to',
    type: Number,
    example: 1,
    required: true,
  })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsNumber({}, { message: 'User ID must be a number' })
  @IsPositive({ message: 'User ID must be a positive number' })
  userId: number;
}
