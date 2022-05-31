import 'source-map-support';
import 'dotenv/config';

import { asValue, createContainer, InjectionMode, Lifetime } from 'awilix';

import server from './server';
import { config } from './config';
import { connectDatabase } from './db';

async function main() {
  const port = config.port;
  const { db } = await connectDatabase();

  const container = createContainer({
    injectionMode: InjectionMode.PROXY,
  });

  container.register({ db: asValue(db) });

  container.loadModules(['repositories/*.js'], {
    resolverOptions: { lifetime: Lifetime.SINGLETON },
  });

  const app = server.listen(port, () => {
    console.log(`Server is started on http://localhost:${port}`);
  });
  return app;
}

export default main();
