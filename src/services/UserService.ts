import userModel, { BaseUserWithoutId } from '../models/UserModel';
import UserRepository from '../repositories/UserRepository';
import { UsernameExistsError } from '../shared/errors';

interface Deps {
  userRepository: UserRepository;
}

export interface AuthResponse {
  userId: string;
  accessToken: {
    value: string;
    expiresAt: number;
  };
}

export default class UserService {
  userRepository: UserRepository;

  constructor({ userRepository }: Deps) {
    this.userRepository = userRepository;
  }

  async signup(signupData: BaseUserWithoutId): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findOne({
      username: signupData.username,
    });

    if (existingUser) throw new UsernameExistsError();

    const user = await userModel(signupData);
    await this.userRepository.insertOne(user);

    const accessToken = await this.userRepository.createAccessToken(
      user.userId
    );

    return { userId: user.userId, accessToken };
  }
}
