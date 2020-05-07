const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
let server;

describe('/api/genres', () => {
  // Start and stop the server before test suit
  beforeEach(() => { server = require('../../index'); });
  afterEach(async () => { 
    await Genre.remove({});
    await server.close(); 
  });

  // Define the happy path, then in each test, change one parameter
  // the clearly aligns with the name of the test
  let token;
  let name;

  const exec = async () => {
    return await request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name: "genre1" });
  }

  beforeEach(() => {
    token = new User().generateToken();
  });

  it('Should return 401 if no token is provided', async() => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it('Should return 400 if token is invalid', async() => {
    token = null;
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it('Should return 200 if token is valid', async() => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
