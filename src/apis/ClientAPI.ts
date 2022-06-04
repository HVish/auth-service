import { route, GET, POST, before } from 'awilix-express';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  AuthroizeResponse,
  CreateClientRequest,
  CreateTokenRequest,
  LaunchRequest,
  VerifyClientResponse,
} from '../interfaces/ClientAPI';

import authenticate from '../middlewares/authenticate';
import validate, { ErrorBody } from '../middlewares/validate';
import { ClientWithoutSecret } from '../models/ClientModel';
import ClientService from '../services/ClientService';
import {
  createClientValidator,
  createTokenValidator,
  launchValidator,
} from '../validators/ClientValidator';

interface Deps {
  clientService: ClientService;
}

@route('/clients')
export default class ClientAPI implements Deps {
  clientService: ClientService;

  constructor({ clientService }: Deps) {
    this.clientService = clientService;
  }

  @route('/v1')
  @POST()
  @before([authenticate, validate(createClientValidator)])
  async create(
    req: Request<never, ErrorBody | ClientWithoutSecret, CreateClientRequest>,
    res: Response<ErrorBody | ClientWithoutSecret>,
    next: NextFunction
  ) {
    try {
      const adminId = req.userId || '';
      const client = await this.clientService.create({ ...req.body, adminId });
      res.status(StatusCodes.CREATED).json(client);
    } catch (error) {
      next(error);
    }
  }

  @route('/v1')
  @GET()
  @before([authenticate])
  async getMyClients(
    req: Request<never, ErrorBody | ClientWithoutSecret[]>,
    res: Response<ErrorBody | ClientWithoutSecret[]>,
    next: NextFunction
  ) {
    try {
      const adminId = req.userId || '';
      const clients = await this.clientService.getAll(adminId);
      res.status(StatusCodes.OK).json(clients);
    } catch (error) {
      next(error);
    }
  }

  @route('/v1/verify')
  @POST()
  @before([validate(launchValidator)])
  async verifyLaunch(
    req: Request<never, ErrorBody | VerifyClientResponse, LaunchRequest>,
    res: Response<ErrorBody | VerifyClientResponse>,
    next: NextFunction
  ) {
    try {
      await this.clientService.verifyLaunch(req.body);
      res.status(StatusCodes.OK).json({ valid: true });
    } catch (error) {
      next(error);
    }
  }

  @route('/v1/authorize')
  @POST()
  @before([validate(createTokenValidator)])
  async authorize(
    req: Request<never, ErrorBody | AuthroizeResponse, CreateTokenRequest>,
    res: Response<ErrorBody | AuthroizeResponse>,
    next: NextFunction
  ) {
    try {
      const result = await this.clientService.authorize(req.body);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}
