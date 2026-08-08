import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'To Do' })
  status: string; // To Do, Doing, Completed, On Hold

  @Column({ default: 'No Priority' })
  priority: string; // No Priority, Low, Medium, High, Urgent

  @Column({ nullable: true })
  dueDate: string;

  @Column({ nullable: true })
  assigneeId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'assigneeId' })
  assignee: User;

  @Column({ nullable: true })
  projectId: string;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column('simple-array', { nullable: true })
  labels: string[]; // simple-array will store as comma-separated string in SQLite

  @Column({ nullable: true })
  parentTaskId: string;

  @ManyToOne(() => Task, (task) => task.subtasks, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'parentTaskId' })
  parentTask: Task;

  @OneToMany(() => Task, (task) => task.parentTask)
  subtasks: Task[];
}
