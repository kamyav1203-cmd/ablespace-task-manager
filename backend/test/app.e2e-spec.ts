import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Pyramid API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/api/projects (GET) - Retrieve seeded projects', () => {
    return request(app.getHttpServer())
      .get('/api/projects')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('name');
      });
  });

  it('/api/tasks (GET) - Retrieve seeded root tasks', () => {
    return request(app.getHttpServer())
      .get('/api/tasks?excludeSubtasks=true')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('/api/auth/guest-login (POST) - Log in Dexter', () => {
    return request(app.getHttpServer())
      .post('/api/auth/guest-login')
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body.user.email).toBe('Dexter@gmail.com');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
