import { BaseUserWithoutId } from '../models/UserModel';
import UserRepository from '../repositories/UserRepository';
import { UsernameExistsError } from '../shared/errors';
import UserService, { AuthResponse } from './UserService';

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
});
