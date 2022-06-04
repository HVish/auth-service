export interface AuthResponse {
  userId: string;
  accessToken: {
    value: string;
    expiresAt: number;
  };
}

export interface LoginBody {
  username: string;
  password: string;
}

export interface GetAuthCodeQuery {
  clientId: string;
}

export interface GetAuthCodeResponse {
  authCode: string;
}

export interface RefreshAccessTokenBody {
  refreshToken: string;
}
