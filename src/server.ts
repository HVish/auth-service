import path from 'path';
import express, { Express, Request, Response, NextFunction } from 'express';
import { asValue, createContainer, InjectionMode, Lifetime } from 'awilix';
import { loadControllers, scopePerRequest } from 'awilix-express';
import cors from 'cors';
import morgan from 'morgan';
import { Db } from 'mongodb';

import { ServerError } from './utils/error';
import { config } from './config';

export default function createServer(db: Db): Express {
  const app = express();

  // middlewares
  app.use(cors());
  app.use(express.json());

  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  const container = createContainer({
    injectionMode: InjectionMode.PROXY,
  });

  container.register({ db: asValue(db) });

  container.loadModules(['repositories/*.js', 'services/*.js'], {
    cwd: __dirname,
    formatName: 'camelCase',
    resolverOptions: { lifetime: Lifetime.SINGLETON },
  });

  app.use(scopePerRequest(container));

  app.use(loadControllers('apis/*.js', { cwd: __dirname, container }));

  app.get('/ping', (_req, res) => {
    res.send('pong');
  });

  if (!config.disableUI) {
    app.use(express.static(path.join(__dirname, 'public')));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { main } = require('./public/server.js');
    main.registerUI(app);
  }

  // register error handler
  app.use(
    (
      err: ServerError | Error,
      _req: Request,
      res: Response,
      next: NextFunction
    ) => {
      if ((err as ServerError).isKnownError) {
        const error = err as ServerError;
        res.status(error.code).json({
          ...error.extras,
          message: error.message,
        });
      } else {
        console.error(err);
        next(err);
      }
    }
  );

  return app;
}
