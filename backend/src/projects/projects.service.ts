import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find({
      relations: { lead: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: { lead: true, tasks: { assignee: true } },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async create(projectData: Partial<Project>): Promise<Project> {
    const project = this.projectsRepository.create(projectData);
    const saved = await this.projectsRepository.save(project);
    return this.findOne(saved.id);
  }

  async update(id: string, projectData: Partial<Project>): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, projectData);
    await this.projectsRepository.save(project);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    await this.projectsRepository.remove(project);
  }
}
