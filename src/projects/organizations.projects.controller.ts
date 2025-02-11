import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseProjectDto } from './dto/response-project.dto';

@ApiTags('Projects')
@Controller('/organizations/:id/projects')
export class OrganizationsProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({ summary: 'Create a new project' })
  @ApiCreatedResponse({
    description: 'The project has been successfully created.',
    type: ResponseProjectDto,
  })
  @ApiBadRequestResponse({
    description: 'Organization not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong.',
  })
  @ApiBody({ type: CreateProjectDto, description: 'Create project details' })
  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Param('id') organizationId: string,
  ) {
    const newProject = await this.projectsService.create(
      +organizationId,
      createProjectDto,
    );
    return newProject;
  }

  @ApiOperation({ summary: 'Get all projects for an organization' })
  @ApiOkResponse({
    description: 'The projects have been successfully retrieved.',
    type: ResponseProjectDto,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'Organization not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong.',
  })
  @Get()
  async findAll(@Param('id') organizationId: string) {
    const projects = await this.projectsService.findAll(+organizationId);
    return projects;
  }
}
