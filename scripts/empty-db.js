/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv/config');
const { MongoClient } = require('mongodb');

async function main() {
  const dbName = 'auth-db';
  const client = await MongoClient.connect(process.env.MONGO_DB_URI);

  try {
    console.log('deleting all users');
    await client.db(dbName).collection('user').deleteMany({});
    console.log('deleting all tenants');
    await client.db(dbName).collection('client').deleteMany({});
    console.log('successfully deleted the seed data');
  } catch (error) {
    console.log('failed to delete the data', error);
  } finally {
    client?.close();
  }
}

if (require.main === module) {
  main().catch(error => console.error(error));
}

module.exports.emptydb = main;
