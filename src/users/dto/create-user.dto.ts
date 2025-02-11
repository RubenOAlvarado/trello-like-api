import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { userRoles } from '../../shared/constants/user.roles';
import { IsEmailUnique } from '../is-email-unique.decorator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'example@io.com',
    required: true,
    type: String,
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email' })
  @IsEmailUnique()
  email: string;

  @ApiProperty({
    description: 'User role',
    example: userRoles.ADMIN,
    required: true,
    type: String,
    enum: userRoles,
  })
  @IsNotEmpty({ message: 'Role is required' })
  @IsString({ message: 'Role must be a string' })
  @IsEnum(userRoles, { message: 'Role must be a valid role' })
  role: string;
}
