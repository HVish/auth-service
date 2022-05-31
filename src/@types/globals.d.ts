import { Db, MongoClient } from 'mongodb';

/* eslint-disable no-var */
declare global {
  var __MONGO_URI__: string;
  var __MONGO_DB_NAME__: string;
  var jestContext: {
    db: Db;
    dbClient: MongoClient;
  };
}
