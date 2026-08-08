import { Controller, Get, Post, Body, Put, Param, Delete, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(
    @Query('projectId') projectId?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('excludeSubtasks') excludeSubtasks?: string,
    @Query('parentTaskId') parentTaskId?: string,
  ): Promise<Task[]> {
    return this.tasksService.findAll({
      projectId,
      status,
      search,
      excludeSubtasks: excludeSubtasks === 'true',
      parentTaskId,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.tasksService.remove(id);
  }
}
