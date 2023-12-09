import joi from 'joi';
import {
  CreateClientRequest,
  CreateTokenRequest,
  LaunchRequest,
} from '../interfaces/ClientAPI';
import { GrantType } from '../models/ClientModel';

export const createClientValidator = (joi: joi.Root) => ({
  body: joi.object<CreateClientRequest, true>({
    logo: joi
      .string()
      .uri({ scheme: ['http', 'https'] })
      .required(),
    name: joi.string().min(4).required(),
    redirectURIs: joi
      .array()
      .items(joi.string().uri({ scheme: ['http', 'https'] }))
      .required(),
    secret: joi.string().min(8).required(),
  }),
});

export const launchValidator = (joi: joi.Root) => ({
  body: joi.object<LaunchRequest, true>({
    clientId: joi.string().required(),
    redirectURI: joi
      .string()
      .uri({ scheme: ['http', 'https'] })
      .required(),
  }),
});

export const createTokenValidator = (joi: joi.Root) => ({
  body: joi.object<CreateTokenRequest, true>({
    clientId: joi.string().required(),
    grant: joi.string().required(),
    grantType: joi.string().valid(GrantType.AUTH_CODE).required(),
    secret: joi.string().required(),
  }),
});
