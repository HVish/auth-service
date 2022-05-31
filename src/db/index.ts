import { MongoClient } from 'mongodb';
import { config } from '../config';

export async function connectDatabase() {
  const client = new MongoClient(config.db.uri);

  // establish connection
  await client.connect();
  const db = client.db(config.db.name);

  // verify connection
  await db.command({ ping: 1 });
  return { client, db };
}
