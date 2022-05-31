const isTestEnv = process.env.NODE_ENV === 'test';

export const config = {
  port: process.env.PORT || 1337,
  db: {
    uri: isTestEnv ? global.__MONGO_URI__ : process.env.MONGO_DB_URI,
    name: isTestEnv ? global.__MONGO_DB_NAME__ : undefined,
  },
};
