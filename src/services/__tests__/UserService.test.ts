import { AuthResponse } from '../../interfaces/UserAPI';
import userModel, { BaseUserWithoutId } from '../../models/UserModel';
import UserRepository from '../../repositories/UserRepository';
import { InvalidCredentialsError, UsernameExistsError } from '../../shared/errors';
import { DateTime, DateTimeUnit } from '../../utils/datetime';
import UserService from '../UserService';

describe('UserService', () => {
  let userService: UserService;

  let refreshToken: string;
  let expiredRefreshToken: string;

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
    const user = await userModel(testUser);
    await userRepository.insertOne(user);

    let token = await userRepository.createRefreshToken(user.userId, '');
    refreshToken = token.value;

    // create an expired refresh token
    token = await userRepository.createRefreshToken(
      user.userId,
      '',
      DateTime.add(new Date(), -10, DateTimeUnit.DAY)
    );

    expiredRefreshToken = token.value;
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

  describe('signup()', () => {
    it('should signup user', async () => {
      const result = await userService.signup({
        ...testUser,
        username: 'some_username',
      });
      expectAuthResponse(result);
    });

    it('should throw UsernameExistsError for existing username', async () => {
      const promise = userService.signup({
        ...testUser,
        username: 'some_username',
      });
      await expect(promise).rejects.toThrow(UsernameExistsError);
    });
  });

  describe('login()', () => {
    it('should throw InvalidCredentialsError for invalid uesrname', async () => {
      const promise = userService.login({
        username: 'invalid_username',
        password: testUser.password,
      });
      await expect(promise).rejects.toThrow(InvalidCredentialsError);
    });

    it('should throw InvalidCredentialsError for invalid password', async () => {
      const promise = userService.login({
        username: testUser.username,
        password: 'invalid_password',
      });
      await expect(promise).rejects.toThrow(InvalidCredentialsError);
    });

    it('should login with valid username and password', async () => {
      const result = await userService.login({
        username: testUser.username,
        password: testUser.password,
      });
      expectAuthResponse(result);
    });
  });

  describe('getAccessTokenByRefreshToken()', () => {
    it('should not create access_token when invalid refresh_token is provided', async () => {
      const promise = userService.getAccessTokenByRefreshToken('');
      await expect(promise).rejects.toThrow(InvalidCredentialsError);
    });

    it('should not create access_token when expired refresh_token is provided', async () => {
      const promise =
        userService.getAccessTokenByRefreshToken(expiredRefreshToken);
      await expect(promise).rejects.toThrow(InvalidCredentialsError);
    });

    it('should create access_token using valid refresh_token', async () => {
      const result = await userService.getAccessTokenByRefreshToken(
        refreshToken
      );
      expectAuthResponse(result);
    });
  });
});
