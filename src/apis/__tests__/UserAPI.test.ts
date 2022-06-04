import { StatusCodes } from 'http-status-codes';
import supertest, { SuperTest, Test } from 'supertest';
import userModel, { BaseUser, BaseUserWithoutId } from '../../models/UserModel';
import { LoginBody } from '../../interfaces/UserAPI';
import UserRepository from '../../repositories/UserRepository';
import createServer from '../../server';

let request: SuperTest<Test>;

beforeAll(() => {
  request = supertest(createServer(global.jestContext.db));
});

describe('POST /users/v1', () => {
  const testUser: BaseUserWithoutId = {
    name: 'test name',
    avatar: 'https://localhost/images/test.png',
    password: 'test_password',
    username: 'test_username1',
  };

  it('should send 201 status', async () => {
    const response = await request.post('/users/v1').send(testUser);
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body).toMatchObject({
      userId: expect.any(String),
      accessToken: expect.objectContaining({
        expiresAt: expect.any(Number),
        value: expect.any(String),
      }),
    });
  });

  it('should send 412 status for existing username', async () => {
    const response = await request.post('/users/v1').send(testUser);
    expect(response.status).toBe(StatusCodes.PRECONDITION_FAILED);
  });
});

describe('POST /users/v1/login', () => {
  const testUser: BaseUser = {
    userId: 'user_id.fTC5paVbEzEpfkBmbiferdh7G7f4cWttYCyzT2z5Zxo',
    name: 'test name',
    avatar: 'https://localhost/images/test.png',
    password: 'test_password',
    username: 'login_username',
  };

  beforeAll(async () => {
    const db = global.jestContext.db;
    const repo = new UserRepository({ db });
    const user = await userModel(testUser);
    await repo.insertOne(user);
  });

  it('should send 201 status', async () => {
    const loginRequest: LoginBody = {
      username: testUser.username,
      password: testUser.password,
    };
    const response = await request.post('/users/v1/login').send(loginRequest);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toMatchObject({
      userId: testUser.userId,
      accessToken: expect.objectContaining({
        expiresAt: expect.any(Number),
        value: expect.any(String),
      }),
    });
  });

  it('should send 412 status for missing fields', async () => {
    const responses = await Promise.all([
      request.post('/users/v1/login').send({ username: testUser.username }),
      request.post('/users/v1/login').send({ password: testUser.password }),
    ]);
    responses.forEach(response => {
      expect(response.status).toBe(StatusCodes.PRECONDITION_FAILED);
    });
  });

  it('should send 401 status for wrong credentials', async () => {
    const loginRequest: LoginBody = {
      username: testUser.username,
      password: 'wrong_password',
    };
    const response = await request.post('/users/v1/login').send(loginRequest);
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});
