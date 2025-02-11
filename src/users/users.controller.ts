import { Controller, Get, Body, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseUserDto } from './dto/response-user.dt';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'List a user by ID' })
  @ApiOkResponse({
    description: 'The user has been successfully retrieved.',
    type: ResponseUserDto,
  })
  @ApiNotFoundResponse({
    description: 'The user was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong.',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    return user;
  }

  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiOkResponse({
    description: 'The user has been successfully updated.',
    type: ResponseUserDto,
  })
  @ApiNotFoundResponse({
    description: 'The user was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong.',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'The user data to update.',
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.update(+id, updateUserDto);
    return updatedUser;
  }

  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiOkResponse({
    description: 'The user has been successfully deleted.',
    type: ResponseUserDto,
  })
  @ApiNotFoundResponse({
    description: 'The user was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong.',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedUser = await this.usersService.remove(+id);
    return deletedUser;
  }
}
