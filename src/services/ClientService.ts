import {
  AuthroizeResponse,
  ClientCredentials,
  CreateTokenRequest,
  LaunchRequest,
} from '../interfaces/ClientAPI';
import clientModel, {
  BaseClient,
  ClientWithoutSecret,
  GrantType,
} from '../models/ClientModel';
import ClientRepository from '../repositories/ClientRepository';
import UserRepository from '../repositories/UserRepository';
import {
  InvalidCredentialsError,
  UnSupportedGrantTypeError,
} from '../shared/errors';
import { Hash } from '../utils/hash';

interface Deps {
  clientRepository: ClientRepository;
  userRepository: UserRepository;
}

export default class ClientService implements Deps {
  clientRepository: ClientRepository;
  userRepository: UserRepository;

  constructor({ clientRepository, userRepository }: Deps) {
    this.clientRepository = clientRepository;
    this.userRepository = userRepository;
  }

  async create(
    baseClient: Omit<BaseClient, 'clientId'>
  ): Promise<ClientWithoutSecret> {
    const client = await clientModel(baseClient);
    await this.clientRepository.insertOne(client);
    const { jwt: _0, secret: _1, ...result } = client;
    return result;
  }

  async getAll(adminId: string): Promise<ClientWithoutSecret[]> {
    return this.clientRepository
      .findMany({ adminId }, { projection: { jwt: false, secret: false } })
      .toArray();
  }

  async verifyLaunch({ clientId, redirectURI }: LaunchRequest) {
    const client = await this.clientRepository.findOne({
      clientId,
      redirectURIs: redirectURI,
    });

    if (!client) throw new InvalidCredentialsError();

    return true;
  }

  async getClientByCredentials({ clientId, secret }: ClientCredentials) {
    const client = await this.clientRepository.findOne({ clientId });

    if (!client) throw new InvalidCredentialsError();

    const isMatch = await Hash.compare(secret, client.secret);

    if (!isMatch) throw new InvalidCredentialsError();

    return client;
  }

  async authorize({
    grant,
    grantType,
    ...credentials
  }: CreateTokenRequest): Promise<AuthroizeResponse> {
    const { clientId } = credentials;
    const client = await this.getClientByCredentials(credentials);

    if (grantType !== GrantType.AUTH_CODE) {
      throw new UnSupportedGrantTypeError();
    }

    const user = await this.userRepository.findOne({
      authCodes: {
        $elemMatch: { clientId, value: grant },
      },
    });

    if (!user) throw new InvalidCredentialsError();

    const { userId, name, avatar } = user;

    const [accessToken, refreshToken] = await Promise.all([
      this.userRepository.createAccessToken(userId, {
        clientId: client.clientId,
        privateKey: {
          key: client.jwt.privateKey,
          passphrase: credentials.secret,
        },
      }),
      this.userRepository.createRefreshToken(userId, credentials.clientId),
      this.userRepository.deleteAuthCode(grant, userId),
    ]);

    return {
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
      user: { id: userId, avatar: avatar || null, name },
    };
  }
}
