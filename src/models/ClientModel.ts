import { promisify } from 'util';
import { generateKeyPair as _generateKeyPair } from 'crypto';
import { ObjectId } from 'mongodb';
import { Hash } from '../utils/hash';
import { BaseModel } from '../shared/BaseModel';
import { generateId } from '../utils/helpers';

const generateKeyPair = promisify(_generateKeyPair);

export enum GrantType {
  AUTH_CODE = 'auth_code',
  ACCESS_TOKEN = 'access_token',
}

export enum ClientStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
}

export interface BaseClient {
  adminId: string;
  clientId: string;
  logo: string;
  name: string;
  redirectURIs: string[];
  secret: string;
}

export interface Client extends BaseModel, BaseClient {
  jwt: {
    privateKey: string;
    publicKey: string;
  };
  status: ClientStatus;
}

export type ClientWithoutSecret = Omit<Client, 'jwt' | 'secret'>;

export default async function clientModel({
  secret,
  clientId = generateId(),
  ...params
}: Optional<BaseClient, 'clientId'>): Promise<ClientWithoutSecret> {
  const { publicKey, privateKey } = await generateKeyPair('rsa', {
    modulusLength: 512,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: secret,
    },
  });

  const client: Client = {
    ...params,
    _id: new ObjectId(),
    clientId,
    createdOn: Date.now(),
    secret: await Hash.create(secret),
    jwt: { privateKey, publicKey },
    status: ClientStatus.ACTIVE,
  };

  return client;
}
