import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseOrganizationDto } from './dto/response-organization.dto';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @ApiOperation({ summary: 'Create organization' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ResponseOrganizationDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong.',
  })
  @ApiBody({
    type: CreateOrganizationDto,
    description: 'Create organization DTO',
  })
  @Post()
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    const newOrganization = await this.organizationsService.create(
      createOrganizationDto,
    );
    return newOrganization;
  }

  @ApiOperation({ summary: 'Get all organizations' })
  @ApiOkResponse({
    description: 'All organizations',
    type: ResponseOrganizationDto,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'No organizations found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong.',
  })
  @Get()
  async findAll() {
    const organizations = await this.organizationsService.findAll();
    return organizations;
  }

  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiOkResponse({
    description: 'Organization found',
    type: ResponseOrganizationDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong.',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const organization = await this.organizationsService.findOne(+id);
    return organization;
  }

  @ApiOperation({ summary: 'Update organization by ID' })
  @ApiOkResponse({
    description: 'Organization updated',
    type: ResponseOrganizationDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong.',
  })
  @ApiBody({
    type: UpdateOrganizationDto,
    description: 'Update organization DTO',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    const updatedOrganization = await this.organizationsService.update(
      +id,
      updateOrganizationDto,
    );
    return updatedOrganization;
  }

  @ApiOperation({ summary: 'Delete organization by ID' })
  @ApiOkResponse({
    description: 'Organization deleted',
    type: ResponseOrganizationDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong.',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedOperations = await this.organizationsService.remove(+id);
    return deletedOperations;
  }
}
