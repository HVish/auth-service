import { randomBytes } from 'crypto';
import { Token, User } from '../models/UserModel';
import { BaseRepository } from '../shared/BaseRepository';
import { DateTime, DateTimeUnit } from '../utils/datetime';

export default class UserRepository extends BaseRepository<User> {
  collectionName = 'user';

  async createAuthCode(userId: string, clientId: string) {
    const now = Date.now();

    const authCode: Token = {
      clientId,
      expiresAt: DateTime.add(now, 15, DateTimeUnit.MINUTE),
      issuedAt: now,
      value: randomBytes(21).toString('base64url'),
    };

    await this.updateOne({ userId }, { $push: { authCodes: authCode } });

    return authCode.value;
  }
}
