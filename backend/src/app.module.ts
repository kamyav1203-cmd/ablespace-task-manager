import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { User } from './users/entities/user.entity';
import { Project } from './projects/entities/project.entity';
import { Task } from './tasks/entities/task.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3' as any,
      database: 'db.sqlite',
      entities: [User, Project, Task],
      synchronize: true, // Auto create schemas (good for prototype/demo)
    }),
    UsersModule,
    ProjectsModule,
    TasksModule,
    AuthModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
