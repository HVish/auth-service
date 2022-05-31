import userModel, { User } from '../models/userModel';
import { DateTime, DateTimeUnit } from '../utils/datetime';
import UserRepository from './UserRepository';

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
});
