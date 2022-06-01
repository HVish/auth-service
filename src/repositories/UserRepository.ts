import { randomBytes } from 'crypto';
import { Token, User } from '../models/UserModel';
import { BaseRepository } from '../shared/BaseRepository';
import { DateTime, DateTimeUnit } from '../utils/datetime';
import { JWT, PrivateKey } from '../utils/jwt';

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

  async deleteAuthCode(code: string, userId: string) {
    await this.updateOne({ userId }, { $pull: { authCodes: { value: code } } });
  }

  async createAccessToken(
    userId: string,
    client?: {
      clientId: string;
      privateKey: PrivateKey;
    }
  ) {
    const payload = client ? { clientId: client.clientId, userId } : { userId };
    const { token: value, expiresAt } = await JWT.create(
      payload,
      client?.privateKey
    );
    return { value, expiresAt };
  }

  async createRefreshToken(
    userId: string,
    clientId: string,
    expiresAt?: number
  ) {
    const now = Date.now();
    const refreshToken: Token = {
      clientId,
      expiresAt: expiresAt ?? DateTime.add(now, 30, DateTimeUnit.DAY),
      issuedAt: now,
      value: randomBytes(128).toString('base64url'),
    };
    await this.updateOne(
      { userId },
      { $push: { refreshTokens: refreshToken } }
    );
    return {
      value: refreshToken.value,
      expiresAt: refreshToken.expiresAt,
    };
  }

  async deleteRefreshToken(token: string, userId: string) {
    await this.updateOne(
      { userId },
      { $pull: { refreshTokens: { value: token } } }
    );
  }
}
