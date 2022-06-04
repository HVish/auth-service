import supertest, { SuperTest, Test } from 'supertest';

import createServer from '../server';

describe('createServer', () => {
  let request: SuperTest<Test>;

  beforeAll(async () => {
    request = supertest(await createServer(global.jestContext.db));
  });

  it('it should respond with poing', async () => {
    const response = await request.get('/ping');
    expect(response.status).toBe(200);
    expect(response.text).toBe('pong');
  });
});
