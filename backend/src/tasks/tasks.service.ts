import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, IsNull } from 'typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findAll(filters: {
    projectId?: string;
    status?: string;
    search?: string;
    excludeSubtasks?: boolean;
    parentTaskId?: string;
  }): Promise<Task[]> {
    const where: any = {};

    if (filters.projectId) {
      where.projectId = filters.projectId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.parentTaskId) {
      where.parentTaskId = filters.parentTaskId;
    } else if (filters.excludeSubtasks) {
      where.parentTaskId = IsNull();
    }

    if (filters.search) {
      where.name = Like(`%${filters.search}%`);
    }

    return this.tasksRepository.find({
      where,
      relations: { assignee: true, project: true },
      order: { dueDate: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: { assignee: true, project: true, subtasks: { assignee: true } },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async create(taskData: Partial<Task>): Promise<Task> {
    const task = this.tasksRepository.create(taskData);
    const saved = await this.tasksRepository.save(task);
    return this.findOne(saved.id);
  }

  async update(id: string, taskData: Partial<Task>): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, taskData);
    await this.tasksRepository.save(task);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
  }
}
