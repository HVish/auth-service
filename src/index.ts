import 'source-map-support';
import 'dotenv/config';

import createServer from './server';
import { config } from './config';
import { connectDatabase } from './db';

async function main() {
  const port = config.port;
  const { db } = await connectDatabase();

  const server = createServer(db);

  const app = server.listen(port, () => {
    console.log(`Server is started on http://localhost:${port}`);
  });

  return app;
}

export default main();
