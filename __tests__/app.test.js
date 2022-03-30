const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const agent = request.agent(app);

//create user for testing
const userToBeTested = {
  email: 'test@test.com',
  password: 'bingo',
};

//create a user so we can gather a cookie
const registerUserAndLogThemIn = async (userProps = {}) => {
  const password = userProps.password ?? userToBeTested.password;

  const user = await UserService.create({ ...userToBeTested, ...userProps });

  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  console.log('agent ------> ', agent);
  return [agent, user];

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
      email: expect.any(String),
    });
  });

  it('signs in a user', async () => {
    const user = await UserService.create({
      email: 'guy1',
      password: '1235',
    });
    console.log(user);

    const res = await agent
      .post('/api/v1/users/sessions')
      .send({ ...user, password: '1235' });
    expect(res.body).toEqual({ message: 'You are Signed In' });
  });

  it('delete cookie and signs out user', async () => {
    // const user = await UserService.create({
    //   email: 'guy1',
    //   password: '1235'
    // });
    const res = await agent.delete('/api/v1/users/sessions');
    expect(res.body).toEqual({
      success: true,
      message: 'Signed out successfully',
    });
  });

  it('returns secrets for a logged in user', async () => {
    // const user = await UserService.create({
    //   email: 'guy1',
    //   password: '1235',
    // });
    const [agent] = await registerUserAndLogThemIn();
    const res = await agent.get('/api/v1/secrets');
    console.log('res body ---------> ', res.body);
    expect(res.body).toEqual([{
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
      createdAt: expect.any(String)
    }]);
  });
});
