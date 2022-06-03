import { AuthResponse } from '../interfaces/UserAPI';
import userModel, { BaseUserWithoutId } from '../models/UserModel';
import UserRepository from '../repositories/UserRepository';
import { InvalidCredentialsError, UsernameExistsError } from '../shared/errors';
import UserService from './UserService';

describe('UserService', () => {
  let userService: UserService;

  const testUser: BaseUserWithoutId = {
    name: 'test name',
    avatar: 'https://localhost/images/test.png',
    password: 'test_password',
    username: 'test_username',
  };

  beforeAll(async () => {
    const db = global.jestContext.db;

    const userRepository = new UserRepository({ db });
    userService = new UserService({ userRepository });

    // insert user to test login with valid credentials
    await userRepository.insertOne(await userModel(testUser));
  });

  const expectAuthResponse = (response: AuthResponse) => {
    expect(response).toMatchObject({
      userId: expect.any(String),
      accessToken: expect.objectContaining({
        expiresAt: expect.any(Number),
        value: expect.any(String),
      }),
    });
  };

  test('signup() should signup user', async () => {
    const result = await userService.signup({
      ...testUser,
      username: 'some_username',
    });
    expectAuthResponse(result);
  });

  test('signup() should throw UsernameExistsError for existing username', async () => {
    try {
      const result = await userService.signup({
        ...testUser,
        username: 'some_username',
      });
      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(UsernameExistsError);
    }
  });

  test('login() should throw InvalidCredentialsError for invalid uesrname', async () => {
    try {
      const result = await userService.login({
        username: 'invalid_username',
        password: testUser.password,
      });
      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidCredentialsError);
    }
  });

  test('login() should throw InvalidCredentialsError for invalid password', async () => {
    try {
      await userService.login({
        username: testUser.username,
        password: 'invalid_password',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidCredentialsError);
    }
  });

  test('login() should login with valid username and password', async () => {
    const result = await userService.login({
      username: testUser.username,
      password: testUser.password,
    });
    expectAuthResponse(result);
  });
});
