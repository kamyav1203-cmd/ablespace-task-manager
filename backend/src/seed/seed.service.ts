import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { Task } from '../tasks/entities/task.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Checking database seed state...');

    const userCount = await this.usersRepository.count();
    if (userCount > 0) {
      this.logger.log('Database already has data. Skipping seed.');
      return;
    }

    this.logger.log('Seeding default data matching Figma designs...');

    // 1. Seed Users
    const dexter = this.usersRepository.create({
      name: 'Dexter',
      email: 'Dexter@gmail.com',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Dexter',
      initials: 'DX',
    });
    const qaTeam = this.usersRepository.create({
      name: 'QA Team',
      email: 'qa@gmail.com',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=QA',
      initials: 'QA',
    });
    const designer = this.usersRepository.create({
      name: 'Designer',
      email: 'designer@gmail.com',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Design',
      initials: 'DS',
    });

    const savedUsers = await this.usersRepository.save([dexter, qaTeam, designer]);
    const uDexter = savedUsers[0];
    const uQA = savedUsers[1];
    const uDesigner = savedUsers[2];

    // 2. Seed Projects
    const p1 = this.projectsRepository.create({
      name: 'Design Homepage',
      priority: 'High',
      leadId: uDexter.id,
      dueDate: '2026-09-12',
    });
    const p2 = this.projectsRepository.create({
      name: 'Develop Login Feature',
      priority: 'Low',
      leadId: uQA.id,
      dueDate: '2026-09-15',
    });
    const p3 = this.projectsRepository.create({
      name: 'Test Payment Gateway',
      priority: 'Medium',
      leadId: uDesigner.id,
      dueDate: '2026-09-18',
    });

    const savedProjects = await this.projectsRepository.save([p1, p2, p3]);
    const projDesign = savedProjects[0];
    const projLogin = savedProjects[1];
    const projPayment = savedProjects[2];

    // 3. Seed Tasks (excluding subtasks first)
    const t1 = this.tasksRepository.create({
      name: 'Write API Documentation',
      description: 'Create comprehensive documentation for REST endpoints, parameters, and payloads.',
      status: 'To Do',
      priority: 'High',
      dueDate: '2026-07-29',
      assigneeId: uDexter.id,
      projectId: projDesign.id,
      labels: ['Deployment'],
    });

    const t2 = this.tasksRepository.create({
      name: 'Implement Search Function',
      description: 'Develop full-text search capabilities across tasks, projects, and users.',
      status: 'To Do',
      priority: 'Medium',
      dueDate: '2026-07-29',
      assigneeId: uDexter.id,
      projectId: projDesign.id,
      labels: ['Deployment'],
    });

    const t3 = this.tasksRepository.create({
      name: 'Deploy to Production',
      description: 'Prepare production release pipeline and deploy build assets to Netlify/Render.',
      status: 'To Do',
      priority: 'Low',
      dueDate: '2026-07-29',
      assigneeId: uDexter.id,
      projectId: projDesign.id,
      labels: ['Deployment'],
    });

    const t4 = this.tasksRepository.create({
      name: 'Code Review Completed',
      description: 'Review pull requests for security flaws and design compliance.',
      status: 'Doing',
      priority: 'Medium',
      dueDate: '2026-07-29',
      assigneeId: uDexter.id,
      projectId: projLogin.id,
      labels: ['Deployment'],
    });

    const t5 = this.tasksRepository.create({
      name: 'Design Mockups Finalized',
      description: 'Confirm latest UI/UX adjustments with stakeholder feedback.',
      status: 'Doing',
      priority: 'Low',
      dueDate: '2026-07-29',
      assigneeId: uDexter.id,
      projectId: projLogin.id,
      labels: ['Deployment'],
    });

    const t6 = this.tasksRepository.create({
      name: 'Feature Testing Passed',
      description: 'Run automated end-to-end user path tests on staging.',
      status: 'Completed',
      priority: 'High',
      dueDate: '2026-07-30',
      assigneeId: uQA.id,
      projectId: projPayment.id,
      labels: ['Testing', 'Passed'],
    });

    const t7 = this.tasksRepository.create({
      name: 'UI Design Updated',
      description: 'Integrate typography adjustments and responsive CSS structures.',
      status: 'Completed',
      priority: 'Medium',
      dueDate: '2026-07-31',
      assigneeId: uDesigner.id,
      projectId: projPayment.id,
      labels: ['Design', 'Updated'],
    });

    const t8 = this.tasksRepository.create({
      name: 'UI Review',
      description: 'Audit mobile layout behaviors and button hitboxes with client designer.',
      status: 'On Hold',
      priority: 'High',
      dueDate: '2026-07-31',
      assigneeId: uDesigner.id,
      projectId: projPayment.id,
      labels: ['Design', 'Review'],
    });

    const t9 = this.tasksRepository.create({
      name: 'Backend Dev',
      description: 'Integrate external gateways and set up webhooks listener.',
      status: 'On Hold',
      priority: 'Medium',
      dueDate: '2026-07-31',
      assigneeId: uDexter.id,
      projectId: projPayment.id,
      labels: ['Development'],
    });

    const savedTasks = await this.tasksRepository.save([
      t1, t2, t3, t4, t5, t6, t7, t8, t9
    ]);
    const taskApiDoc = savedTasks[0];

    // 4. Seed Subtasks for 'Write API Documentation' (taskApiDoc)
    const st1 = this.tasksRepository.create({
      name: 'Research existing APIs',
      status: 'To Do',
      priority: 'High',
      assigneeId: uDexter.id,
      parentTaskId: taskApiDoc.id,
    });
    const st2 = this.tasksRepository.create({
      name: 'Draft endpoint specs',
      status: 'To Do',
      priority: 'Medium',
      assigneeId: uDexter.id,
      parentTaskId: taskApiDoc.id,
    });
    const st3 = this.tasksRepository.create({
      name: 'Review specs with team',
      status: 'To Do',
      priority: 'Low',
      assigneeId: uDexter.id,
      parentTaskId: taskApiDoc.id,
    });

    await this.tasksRepository.save([st1, st2, st3]);

    this.logger.log('Database seeding successfully completed!');
  }
}
