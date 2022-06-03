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
