import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, VersioningType } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.enableVersioning({
      type: VersioningType.URI,
    });

    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  const rawData = {
    data: 'user-1',
  };

  let encryptedData = null;

  it('/v1.0/auth/encrypt/text (POST)', () => {
    return request(app.getHttpServer())
      .post('/v1.0/auth/encrypt/text')
      .send(rawData)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('iv');
        expect(response.body).toHaveProperty('data');
        encryptedData = response.body;
      });
  });

  it('/v1.0/auth/decrypt/text (POST)', () => {
    return request(app.getHttpServer())
      .post('/v1.0/auth/decrypt/text')
      .send(encryptedData)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toEqual(rawData.data);
        encryptedData = response.body;
      });
  });
});
