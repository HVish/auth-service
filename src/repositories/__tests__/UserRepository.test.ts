import userModel, { User } from '../../models/UserModel';
import { mockPrivateKey } from '../../test-utils/mocks/jwt';
import { DateTime, DateTimeUnit } from '../../utils/datetime';
import UserRepository from '../UserRepository';

describe('UserRepository', () => {
  let testUser: User;
  let repo: UserRepository;

  beforeAll(async () => {
    repo = new UserRepository({ db: global.jestContext.db });
    testUser = await userModel({
      name: 'test name',
      avatar: 'https://localhost/images/test.png',
      password: 'test_password',
      username: 'test_username',
    });
    await repo.insertOne(testUser);
  });

  test('createAuthCode() should create auth-code', async () => {
    const clientId = 'test_client_id';
    const authCode = await repo.createAuthCode(testUser.userId, clientId);

    expect(authCode).toBeTruthy();

    const user = await repo.findOne({ userId: testUser.userId });
    const authCodeDoc = user?.authCodes.find(ac => ac.value === authCode);

    expect(authCodeDoc?.value).toBe(authCode);
    expect(authCodeDoc?.clientId).toBe(clientId);

    expect(authCodeDoc?.expiresAt).toBeLessThanOrEqual(
      DateTime.add(Date.now(), 15, DateTimeUnit.MINUTE)
    );
  });

  test('deleteAuthCode() should delete auth_code', async () => {
    const clientId = 'test_client_id';
    const authCode = await repo.createAuthCode(testUser.userId, clientId);

    let user = await repo.findOne({ userId: testUser.userId });
    let authCodeDoc = user?.authCodes.find(ac => ac.value === authCode);
    expect(authCodeDoc?.value).toBe(authCode);

    await repo.deleteAuthCode(authCode, testUser.userId);

    user = await repo.findOne({ userId: testUser.userId });
    authCodeDoc = user?.authCodes.find(ac => ac.value === authCode);
    expect(authCodeDoc).toBeUndefined();
  });

  test('createAccessToken() should create access_token', async () => {
    const clientId = 'test_client_id';

    const accessToken1 = await repo.createAccessToken(testUser.userId);
    expect(accessToken1).toBeTruthy();

    const accessToken2 = await repo.createAccessToken(testUser.userId, {
      clientId,
      privateKey: mockPrivateKey,
    });

    expect(accessToken2).toBeTruthy();
    expect(accessToken1).not.toBe(accessToken2);
  });

  test('createRefreshToken() should create refresh_token', async () => {
    const clientId = 'test_client_id';
    const refreshToken = await repo.createRefreshToken(
      testUser.userId,
      clientId
    );

    expect(refreshToken).toBeTruthy();

    const user = await repo.findOne({ userId: testUser.userId });
    const refreshTokenDoc = user?.refreshTokens.find(
      rt => rt.value === refreshToken.value
    );

    expect(refreshTokenDoc?.value).toBe(refreshToken.value);
    expect(refreshTokenDoc?.clientId).toBe(clientId);

    expect(refreshTokenDoc?.expiresAt).toBeLessThanOrEqual(
      DateTime.add(Date.now(), 30, DateTimeUnit.DAY)
    );
  });

  test('deleteRefreshToken() should delete refresh_token', async () => {
    const clientId = 'test_client_id';

    const refreshToken = await repo.createRefreshToken(
      testUser.userId,
      clientId
    );

    let user = await repo.findOne({ userId: testUser.userId });
    let refreshTokenDoc = user?.refreshTokens.find(
      ac => ac.value === refreshToken.value
    );

    expect(refreshTokenDoc?.value).toBe(refreshToken.value);

    await repo.deleteRefreshToken(refreshToken.value, testUser.userId);

    user = await repo.findOne({ userId: testUser.userId });
    refreshTokenDoc = user?.refreshTokens.find(
      ac => ac.value === refreshToken.value
    );

    expect(refreshTokenDoc).toBeUndefined();
  });
});
