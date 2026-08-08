import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @IsIn(['High', 'Medium', 'Low'])
  priority?: string;

  @IsString()
  @IsOptional()
  leadId?: string;

  @IsString()
  @IsOptional()
  dueDate?: string;
}
