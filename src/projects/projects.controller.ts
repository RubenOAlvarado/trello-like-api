import { Controller, Get, Body, Param, Delete, Put } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseProjectDto } from './dto/response-project.dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({ summary: 'Get all projects' })
  @ApiOkResponse({
    description: 'The projects have been successfully retrieved.',
    type: ResponseProjectDto,
  })
  @ApiNotFoundResponse({
    description: 'Project not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong.',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const project = await this.projectsService.findOne(+id);
    return project;
  }

  @ApiOperation({ summary: 'Update a project' })
  @ApiOkResponse({
    description: 'The project has been successfully updated.',
    type: ResponseProjectDto,
  })
  @ApiNotFoundResponse({
    description: 'Project not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong.',
  })
  @ApiBody({ type: UpdateProjectDto, description: 'Update project details' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const updatedProject = await this.projectsService.update(
      +id,
      updateProjectDto,
    );
    return updatedProject;
  }

  @ApiOperation({ summary: 'Delete a project' })
  @ApiOkResponse({
    description: 'The project has been successfully deleted.',
    type: ResponseProjectDto,
  })
  @ApiNotFoundResponse({
    description: 'Project not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong.',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedProject = await this.projectsService.remove(+id);
    return deletedProject;
  }
}
