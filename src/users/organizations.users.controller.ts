import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dt';

@ApiTags('Users')
@Controller('organizations/:id/users')
export class OrganizationsUsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a user for an organization' })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: ResponseUserDto,
  })
  @ApiBadRequestResponse({
    description: 'The organization was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong.',
  })
  @ApiBody({ type: CreateUserDto, description: 'User data' })
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Param('id') organizationId: string,
  ) {
    const newUser = await this.usersService.create(
      +organizationId,
      createUserDto,
    );
    return newUser;
  }

  @ApiOperation({ summary: 'List all users for an organization' })
  @ApiOkResponse({
    description: 'The users have been successfully retrieved.',
    type: ResponseUserDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'The organization was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong.',
  })
  @Get()
  async findAll(@Param('id') organizationId: string) {
    const users = await this.usersService.findAll(+organizationId);
    return users;
  }
}
