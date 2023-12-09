/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv/config');
const { MongoClient, ObjectId } = require('mongodb');

const { emptydb } = require('./empty-db');

const users = [
  {
    _id: ObjectId('65743153e93a999b93e529ee'),
    name: 'Vishnu Singh',
    username: 'vishnu@auth-service.com',
    userId:
      'yuXffqKH1_CHsDmqn4GYD9lul1NT8ljLAilW8un-uMBlMETYn_0auwMROjS6kBrPYoTY0-FDJt4Jcqdv-6ARWw',
    authCodes: [],
    createdOn: 1702113619029,
    password: '$2b$10$9dl0hHFIbzpbD1hdkNuXYewrxGKr/cGTTDkQjiV3OuwSYeP3sqrEe',
    refreshTokens: [],
    status: 'active',
  },
];

const tenants = [
  {
    _id: ObjectId('65743153e93a999b93e529ef'),
    logo: 'http://localhost:3000/client-logo.png',
    name: 'auth-tenant',
    adminId:
      'yuXffqKH1_CHsDmqn4GYD9lul1NT8ljLAilW8un-uMBlMETYn_0auwMROjS6kBrPYoTY0-FDJt4Jcqdv-6ARWw',
    clientId:
      '8CmySXf0XWdq9OgeU7verhnHdC7cXDHO__NE09AIFxwkeRMny4v967VVbhQ2PobLVScVgN9XWU_uva4ERcHnGw',
    createdOn: 1702113619100,
    secret: '$2b$10$2GvC6VNpqthTBFqMep10uOX1nttJN1cfQCDl6kI3Ll3Mu5pMv0W4W',
    redirectURIs: ['http://localhost:3000/auth'],
    jwt: {
      privateKey:
        '-----BEGIN ENCRYPTED PRIVATE KEY-----\n' +
        'MIIBvTBXBgkqhkiG9w0BBQ0wSjApBgkqhkiG9w0BBQwwHAQIlfO92N6CWp8CAggA\n' +
        'MAwGCCqGSIb3DQIJBQAwHQYJYIZIAWUDBAEqBBD+viijfW2rHes+c85l7W9TBIIB\n' +
        'YKh/4MWP70izl/f4GhLsr0W7g02GKnElcXcn49N9vFTPx2mgMhtHb+AkbQF0axLi\n' +
        'uw7tqbfWrYwTPW8wET8NPtvUAkIC+lNGoIZxoNg2zXUWF1+zPVyHqdyHzzyWyn/q\n' +
        'QQlHtKZ5YQFz1kjqxqCqB+WUfjQgc/CtC0/0m6ynS/ZW/NTBqMjgfcg4eamiyOsL\n' +
        'gydFJgmelJ+eIFzLFqUEvzApaE6CYuzhWXTeRD9g8tDKzi9p5cJXbez7nncj06jA\n' +
        'Ep4nWVxIEeR1oAfdSsdv2Y+GGE3OWeLqSusTT8az7vUY0GVvxR1MlICi5jxGDwdc\n' +
        'l+wE5jL1V3TkzU1PgdE4Bk55TieaPilshfyQ4OSqPg01NfaDKbVd5a0Q9QOwSuCo\n' +
        'vo09jFErikH5iW0OTo+GNV1f8LCpxBVEJG3r12An1bk/78fTgdpmQY02XUQBpRmh\n' +
        '8jMYku3POibHjBylWASyOe4=\n' +
        '-----END ENCRYPTED PRIVATE KEY-----\n',
      publicKey:
        '-----BEGIN PUBLIC KEY-----\n' +
        'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAOUIqHRdTJSsUtIWgFK+EQKUU6YISEkB\n' +
        '2HduUcScnT9SlxW7cmypTMcy0LoIVo9AluhVKcXWDZoXdchld6T8CBcCAwEAAQ==\n' +
        '-----END PUBLIC KEY-----\n',
    },
    status: 'active',
  },
];

async function main() {
  const dbName = 'auth-db';
  const client = await MongoClient.connect(process.env.MONGO_DB_URI);

  try {
    await emptydb();
    console.log('inserting the seed data');
    await client.db(dbName).collection('user').insertMany(users);
    await client.db(dbName).collection('client').insertMany(tenants);
    console.log('successfully inserted the seed data');
  } catch (error) {
    console.log('failed to seed the data', error);
  } finally {
    client?.close();
  }
}

main().catch(error => console.error(error));
