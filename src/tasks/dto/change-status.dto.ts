import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class ChangeStatusDto {
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
}
