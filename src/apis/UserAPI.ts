import { route, GET, POST, before } from 'awilix-express';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  AuthResponse,
  GetAuthCodeQuery,
  GetAuthCodeResponse,
  LoginBody,
  RefreshAccessTokenBody,
} from '../interfaces/UserAPI';
import authenticate from '../middlewares/authenticate';
import validate, { ErrorBody } from '../middlewares/validate';
import { BaseUserWithoutId } from '../models/UserModel';
import UserService from '../services/UserService';
import {
  getAuthCodeValidator,
  loginValidator,
  refreshAccessTokenValidator,
  signupValidator,
} from '../validators/UserValidator';

interface Deps {
  userService: UserService;
}

@route('/users')
export default class UserAPI {
  userService: UserService;

  constructor({ userService }: Deps) {
    this.userService = userService;
  }

  @route('/v1')
  @POST()
  @before([validate(signupValidator)])
  async signup(
    req: Request<never, ErrorBody | AuthResponse, BaseUserWithoutId>,
    res: Response<ErrorBody | AuthResponse>,
    next: NextFunction
  ) {
    try {
      const result = await this.userService.signup(req.body);
      res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  }

  @route('/v1/login')
  @POST()
  @before([validate(loginValidator)])
  async login(
    req: Request<never, ErrorBody | AuthResponse, LoginBody>,
    res: Response<ErrorBody | AuthResponse>,
    next: NextFunction
  ) {
    try {
      const result = await this.userService.login(req.body);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  @route('/v1/auth-code')
  @GET()
  @before([authenticate, validate(getAuthCodeValidator)])
  async getAuthCode(
    req: Request<
      never,
      ErrorBody | GetAuthCodeResponse,
      never,
      GetAuthCodeQuery
    >,
    res: Response<ErrorBody | GetAuthCodeResponse>,
    next: NextFunction
  ) {
    try {
      const userId = req.userId || '';
      const { clientId } = req.query;
      const authCode = await this.userService.getAuthCode(userId, clientId);
      res.status(StatusCodes.OK).json({ authCode });
    } catch (error) {
      next(error);
    }
  }

  @route('/v1/access-tokens/refresh')
  @POST()
  @before([validate(refreshAccessTokenValidator)])
  async getAccessTokenByRefreshToken(
    req: Request<never, ErrorBody | AuthResponse, RefreshAccessTokenBody>,
    res: Response<ErrorBody | AuthResponse>,
    next: NextFunction
  ) {
    try {
      const result = await this.userService.getAccessTokenByRefreshToken(
        req.body.refreshToken
      );
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}
