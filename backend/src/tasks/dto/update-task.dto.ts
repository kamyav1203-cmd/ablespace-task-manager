import { IsString, IsOptional, IsIn, IsArray } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsIn(['To Do', 'Doing', 'Completed', 'On Hold'])
  status?: string;

  @IsString()
  @IsOptional()
  @IsIn(['No Priority', 'Low', 'Medium', 'High', 'Urgent'])
  priority?: string;

  @IsString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  assigneeId?: string;

  @IsString()
  @IsOptional()
  projectId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  labels?: string[];

  @IsString()
  @IsOptional()
  parentTaskId?: string;
}
