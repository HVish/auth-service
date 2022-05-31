import { ObjectId } from 'mongodb';
import { Hash } from '../utils/hash';
import { generateId } from '../utils/helpers';
import { BaseModel } from '../shared/BaseModel';

export enum UserStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
}

export interface Token {
  clientId: string;
  expiresAt: UnixTime;
  issuedAt: UnixTime;
  value: string;
}

export interface BaseUser {
  userId: string;
  name: string;
  username: string;
  password: string;
  avatar?: string;
}

export type BaseUserWithoutId = Omit<BaseUser, 'userId'>;

export interface User extends BaseModel, BaseUser {
  authCodes: Token[];
  refreshTokens: Token[];
  status: UserStatus;
}

export default async function userModel({
  userId = generateId(),
  password,
  ...params
}: Optional<BaseUser, 'userId'>) {
  const user: User = {
    ...params,
    _id: new ObjectId(),
    userId,
    authCodes: [],
    createdOn: Date.now(),
    password: await Hash.create(password),
    refreshTokens: [],
    status: UserStatus.ACTIVE,
  };
  return user;
}
