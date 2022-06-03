import { AuthResponse, LoginBody } from '../interfaces/UserAPI';
import userModel, { BaseUserWithoutId } from '../models/UserModel';
import UserRepository from '../repositories/UserRepository';
import { InvalidCredentialsError, UsernameExistsError } from '../shared/errors';
import { Hash } from '../utils/hash';

interface Deps {
  userRepository: UserRepository;
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

  async login({ username, password }: LoginBody): Promise<AuthResponse> {
    const user = await this.userRepository.findOne({ username });

    if (!user) throw new InvalidCredentialsError();

    const isMatch = await Hash.compare(password, user.password);

    if (!isMatch) throw new InvalidCredentialsError();

    const { userId } = user;
    const accessToken = await this.userRepository.createAccessToken(userId);

    return { userId, accessToken };
  }
}
