import { ClientCredentials, LaunchRequest } from '../../interfaces/ClientAPI';
import clientModel, {
  BaseClient,
  Client,
  GrantType,
} from '../../models/ClientModel';
import userModel, { BaseUser } from '../../models/UserModel';
import ClientRepository from '../../repositories/ClientRepository';
import UserRepository from '../../repositories/UserRepository';
import { InvalidCredentialsError } from '../../shared/errors';
import ClientService from '../ClientService';

describe('ClientService', () => {
  let clientService: ClientService;

  let clientRepository: ClientRepository;
  let userRepository: UserRepository;

  const testClient: BaseClient = {
    adminId: 'user_id.4t8B7BPU_bcHCR7UmUR02spwEUZFyIQ6RnXGWVfntvU',
    clientId:
      'client_id.DofWnfd411fDEyl+EhsRNyRRkv5Q/mPSVqlC/h85NFK2G3b3M1PyUm0oEu/ArnieU8hSyq+PoyRsp8YGTLg/Ag==',
    secret: 'test_secret',
    name: 'company name',
    logo: 'https://localhost/images/company_logo.png',
    redirectURIs: [
      'https://localhost/auth-success',
      'https://localhost/auth-failure',
    ],
  };

  beforeAll(async () => {
    const db = global.jestContext.db;

    clientRepository = new ClientRepository({ db });
    userRepository = new UserRepository({ db });

    clientService = new ClientService({ clientRepository, userRepository });

    await clientRepository.insertOne(await clientModel(testClient));
  });

  test('create() should create a client and return it', async () => {
    const params: Omit<BaseClient, 'clientId'> = {
      adminId: 'user_id.1mH1jJ-AfwV_H0Un6V1KXAb2QSsf5EvSpKWss3TYib8',
      logo: '',
      name: 'test-client-name',
      redirectURIs: [],
      secret: 'test-client-secret',
    };

    const result = await clientService.create(params);

    expect(result).toBeDefined();

    expect((result as Client).jwt).toBeUndefined();
    expect((result as Client).secret).toBeUndefined();

    expect(result).toEqual(
      expect.objectContaining({
        adminId: params.adminId,
        name: params.name,
        logo: params.logo,
      })
    );
  });

  test('getAll() should return all clients created by an admin user', async () => {
    const adminId = 'user_id.3DH7laE-mvujpsfvQHO1Rb0Fq2xac27yJjJl2M90h3Q';

    const baseClient: Omit<BaseClient, 'adminId' | 'clientId'> = {
      secret: 'test_secret',
      name: 'company name',
      logo: 'https://localhost/images/company_logo.png',
      redirectURIs: [
        'https://localhost/auth-success',
        'https://localhost/auth-failure',
      ],
    };

    const testClients = [
      { ...baseClient, name: 'client_1', adminId },
      { ...baseClient, name: 'client_2', adminId },
    ];

    await clientRepository.insertMany(
      await Promise.all(testClients.map(clientModel))
    );

    const clients = await clientService.getAll(adminId);

    expect(clients.length).toBe(testClients.length);
    expect(clients.map(c => c.name)).toEqual(
      expect.arrayContaining(testClients.map(c => c.name))
    );
  });

  describe('verifyLaunch()', () => {
    const validLaunchData: LaunchRequest = {
      clientId: testClient.clientId,
      redirectURI: testClient.redirectURIs[0],
    };

    it('should return true', async () => {
      const result = await clientService.verifyLaunch(validLaunchData);
      expect(result).toBe(true);
    });

    it('should reject', async () => {
      const verifyArray = await Promise.allSettled([
        clientService.verifyLaunch({
          ...validLaunchData,
          clientId: 'wrong_clientId',
        }),
        clientService.verifyLaunch({
          ...validLaunchData,
          redirectURI: 'https://localhost/un-registered-url',
        }),
      ]);
      verifyArray.forEach(result => {
        expect(result.status).toBe('rejected');
        expect((result as PromiseRejectedResult).reason).toBeInstanceOf(
          InvalidCredentialsError
        );
      });
    });
  });

  describe('getClientByCredentials()', () => {
    const correctCredentials: ClientCredentials = {
      clientId: testClient.clientId,
      secret: testClient.secret,
    };

    it('should return client for valid credentials', async () => {
      const result = await clientService.getClientByCredentials(
        correctCredentials
      );
      expect(result).toEqual(
        expect.objectContaining({
          clientId: correctCredentials.clientId,
        })
      );
    });

    it('should reject for invalid credentials', async () => {
      const promise = clientService.getClientByCredentials({
        ...correctCredentials,
        secret: 'wrong_secret',
      });
      expect(promise).rejects.toThrow(InvalidCredentialsError);
    });
  });

  describe('authorize()', () => {
    let grant: string;

    const user: BaseUser = {
      userId: 'user_id.S9AHZjEhH5CPmxFxj-GVwmNd7NbPhdryXVvobCmWhFA',
      password: 'test_password',
      avatar: '',
      name: 'some name',
      username: 'username',
    };

    const client: BaseClient = {
      adminId: 'user_id.F20jNuM8m2asob47ATYJo3oEbIFZ1TqFyOFoW7LNExw',
      clientId:
        'client_id.tfvJKag-C9KnVwZED7AQJdj1J_qWiwGw7hxexALI4IHTQjEtkcFUREEHjfY-jLUtbpAi3nF2EJB7OMkOB3hFRA',
      secret: 'test_secret',
      name: 'company name',
      logo: 'https://localhost/images/company_logo.png',
      redirectURIs: [
        'https://localhost/auth-success',
        'https://localhost/auth-failure',
      ],
    };

    const clientCredentials: ClientCredentials = {
      clientId: client.clientId,
      secret: client.secret,
    };

    beforeAll(async () => {
      await Promise.all([
        userRepository.insertOne(await userModel(user)),
        clientRepository.insertOne(await clientModel(client)),
      ]);
      grant = await userRepository.createAuthCode(user.userId, client.clientId);
    });

    it('should create access_token and refresh_token', async () => {
      const result = await clientService.authorize({
        ...clientCredentials,
        grant,
        grantType: GrantType.AUTH_CODE,
      });

      const _user = await userRepository.findOne({ 'authCodes.value': grant });

      expect(_user).toBeFalsy();
      expect(result).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
          user: expect.objectContaining({
            id: expect.any(String),
            avatar: user.avatar || null,
            name: user.name,
          }),
        })
      );
    });
  });
});
