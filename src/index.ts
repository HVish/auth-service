import 'source-map-support';
import 'dotenv/config';

import server from './server';
import { config } from './config';

async function main() {
  // start database or other services
  const port = config.port;
  const app = server.listen(port, () => {
    console.log(`Server is started on http://localhost:${port}`);
  });
  return app;
}

export default main();
