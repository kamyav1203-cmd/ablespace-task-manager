import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 'Medium' })
  priority: string; // High, Medium, Low

  @Column({ nullable: true })
  leadId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'leadId' })
  lead: User;

  @Column({ nullable: true })
  dueDate: string;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
