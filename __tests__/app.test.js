 const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');


//create user for testing
const userToBeTested = {
  email: 'test@test.com',
  password: 'bingo'
};

describe('alchemy-app routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });


  it('create a user with email and password', async () => {
    const res = await request(app).post('/api/v1/users').send(userToBeTested);
    expect(res.body).toEqual({
      id: expect.any(String),
      email: expect.any(String)
    });
  });




});
