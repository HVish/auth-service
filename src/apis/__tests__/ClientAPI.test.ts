import { StatusCodes } from 'http-status-codes';
import supertest, { SuperTest, Test } from 'supertest';
import { CreateClientRequest } from '../../interfaces/ClientAPI';
import clientModel, { BaseClient, GrantType } from '../../models/ClientModel';
import userModel, { BaseUser } from '../../models/UserModel';
import ClientRepository from '../../repositories/ClientRepository';
import UserRepository from '../../repositories/UserRepository';
import createServer from '../../server';

let jwt: string;
let request: SuperTest<Test>;

let userRepository: UserRepository;
let clientRepository: ClientRepository;

let adminJwt: string;
const adminId = 'user_id.ymOr488bmyGHonSUvqvm1QT2xUM0urES2PtFRCTm44U';

const user: BaseUser = {
  userId: 'user_id.auVNL6KgKozplSRQdnf6nqyX_gcxAPuPVRKIHf6EHb0',
  password: 'test_password',
  avatar: '',
  name: 'some name',
  username: 'username',
};

const testClient: BaseClient = {
  adminId,
  clientId:
    'client_id.ZDHk-5LTLWO0TOVP1WhzKqNliEGk6eIgEUrENoA2SZRMOrWE4o-Br_pcV-nK_zVT4bgFw2UCXGutu_rv_pWqCg',
  secret: 'fNFiPTQRVZOVBSuq',
  name: 'company name',
  logo: 'https://localhost/images/company_logo.png',
  redirectURIs: [
    'https://localhost/auth-success',
    'https://localhost/auth-failure',
  ],
};

beforeAll(async () => {
  const db = global.jestContext.db;

  request = supertest(createServer(db));

  userRepository = new UserRepository({ db });
  clientRepository = new ClientRepository({ db });

  await Promise.all([
    userRepository.insertOne(await userModel(user)),
    clientRepository.insertOne(await clientModel(testClient)),
  ]);

  [jwt, adminJwt] = await Promise.all([
    (await userRepository.createAccessToken(user.userId)).value,
    (await userRepository.createAccessToken(adminId)).value,
  ]);
});

describe('GET /clients/v1', () => {
  it('should send 403 status when auth-token is not provided', async () => {
    const response = await request.get('/clients/v1');
    expect(response.status).toBe(StatusCodes.FORBIDDEN);
  });
  it('should send 200 status', async () => {
    const response = await request
      .get('/clients/v1')
      .set('Authorization', `Bearer ${adminJwt}`);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveLength(1);
  });
});

describe('POST /clients/v1', () => {
  const payload: CreateClientRequest = {
    logo: 'https://localhost/images/company_logo.png',
    name: 'test client name',
    redirectURIs: [],
    secret: 'test-client-secret',
  };
  it('should send 403 status when auth-token is not provided', async () => {
    const response = await request.post('/clients/v1').send(payload);
    expect(response.status).toBe(StatusCodes.FORBIDDEN);
  });
  it('should send 200 status', async () => {
    const response = await request
      .post('/clients/v1')
      .set('Authorization', `Bearer ${jwt}`)
      .send(payload);
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body).toMatchObject({
      logo: payload.logo,
      name: payload.name,
      redirectURIs: payload.redirectURIs,
    });
  });
});

describe('POST /clients/v1/verify', () => {
  it('should send 200 status', async () => {
    const response = await request.post('/clients/v1/verify').send({
      clientId: testClient.clientId,
      redirectURI: testClient.redirectURIs[0],
    });
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toMatchObject({
      valid: expect.any(Boolean),
    });
  });
  it('should send 401 status for wrong client redirect URI', async () => {
    const response = await request.post('/clients/v1/verify').send({
      clientId: testClient.clientId,
      redirectURI: 'https://hacker/auth-success',
    });
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});

describe('POST /clients/v1/authorize', () => {
  let authCode: string;

  beforeAll(async () => {
    authCode = await userRepository.createAuthCode(
      user.userId,
      testClient.clientId
    );
  });

  it('should send 200 status', async () => {
    const response = await request.post('/clients/v1/authorize').send({
      clientId: testClient.clientId,
      grant: authCode,
      grantType: GrantType.AUTH_CODE,
      secret: testClient.secret,
    });
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      user: expect.objectContaining({
        id: expect.any(String),
        avatar: expect.nullOrAny(String),
        name: expect.any(String),
      }),
    });
  });
  it('should send 401 status for wrong client secret', async () => {
    const response = await request.post('/clients/v1/authorize').send({
      clientId: testClient.clientId,
      grant: authCode,
      grantType: GrantType.AUTH_CODE,
      secret: 'wrong secret',
    });
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});
