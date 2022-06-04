import joi from 'joi';
import {
  GetAuthCodeQuery,
  LoginBody,
  RefreshAccessTokenBody,
} from '../interfaces/UserAPI';
import { BaseUser } from '../models/UserModel';

export const signupValidator = (joi: joi.Root) => ({
  body: joi.object<Omit<BaseUser, 'userId'>, true>({
    avatar: joi.string().uri({ scheme: 'https' }).optional(),
    name: joi.string().required(),
    username: joi.string().required(),
    password: joi.string().required(),
  }),
});

export const loginValidator = (joi: joi.Root) => ({
  body: joi.object<LoginBody, true>({
    username: joi.string().required(),
    password: joi.string().required(),
  }),
});

export const getAuthCodeValidator = (joi: joi.Root) => ({
  query: joi.object<GetAuthCodeQuery, true>({
    clientId: joi.string().required(),
  }),
});

export const refreshAccessTokenValidator = (joi: joi.Root) => ({
  body: joi.object<RefreshAccessTokenBody, true>({
    refreshToken: joi.string().required(),
  }),
});
