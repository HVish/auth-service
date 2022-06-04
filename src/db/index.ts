import { MongoClient } from 'mongodb';
import { config } from '../config';

export async function connectDatabase() {
  // establish connection
  const client = await MongoClient.connect(config.db.uri);
  const db = client.db(config.db.name);

  // verify connection
  await db.command({ ping: 1 });
  return { client, db };
}
