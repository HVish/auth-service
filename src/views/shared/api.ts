import request from './request';
import { getAccessToken } from './session';
import { Client } from './types';

interface SignupPayload {
  name: string;
  username: string;
  password: string;
  avatar?: string;
}

interface AuthResponse {
  userId: string;
  accessToken: {
    value: string;
    expiresAt: number;
  };
}

export async function signup(data: SignupPayload) {
  return (await request.post<AuthResponse>('/users/v1', data)).data;
}

interface LoginPayload {
  username: string;
  password: string;
}

export async function login(data: LoginPayload) {
  return (await request.post<AuthResponse>('/users/v1/login', data)).data;
}

interface VerifyClientPayload {
  clientId: string;
  redirectURI: string;
}

interface VerifyClientResponse {
  valid: boolean;
}

export async function verifyClient(data: VerifyClientPayload) {
  return (await request.post<VerifyClientResponse>('/clients/v1/verify', data))
    .data;
}

interface GetAuthCodeResponse {
  authCode: string;
}

export async function getAuthCode(clientId: string) {
  const response = await request.get<GetAuthCodeResponse>(
    '/users/v1/auth-code',
    {
      params: { clientId },
      headers: {
        authorization: `Bearer ${getAccessToken()}`,
      },
    }
  );
  return response.data;
}

interface RegisterClientPayload {
  logo: string;
  name: string;
  redirectURIs: string[];
  secret: string;
}

export async function registerClient(data: RegisterClientPayload) {
  const response = await request.post<Client>('/clients/v1', data, {
    headers: {
      authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return response.data;
}

export async function getMyClients() {
  const response = await request.get<Client[]>('/clients/v1', {
    headers: {
      authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return response.data;
}
