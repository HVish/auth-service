import { connectDatabase } from '../db';
import './NullOrAny';

beforeAll(async () => {
  const { db, client } = await connectDatabase();
  global.jestContext = { db, dbClient: client };
});

afterAll(async () => {
  await global.jestContext.dbClient.close();
});
