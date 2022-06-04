import { BaseClient, GrantType } from '../models/ClientModel';

export interface LaunchRequest {
  clientId: string;
  redirectURI: string;
}

export interface ClientCredentials {
  clientId: string;
  secret: string;
}
export type CreateClientRequest = Omit<BaseClient, 'adminId' | 'clientId'>;

export interface VerifyClientResponse {
  valid: boolean;
}

export interface CreateTokenRequest extends ClientCredentials {
  grant: string;
  /**
   * Only `auth_code` supported
   */
  grantType: GrantType.AUTH_CODE;
}

export interface AuthroizeResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    avatar: string | null;
    name: string;
  };
}
