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

  describe('GET /', () => {
    it('Should return all the genres', async () => {
      // Insert genres into the database
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" }
      ]);

      // Send a get request using the server object
      const res = await request(server).get('/api/genres');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
      expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('Should return the genre associated with the id', async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      // Send a get request using the server object
      const res = await request(server).get('/api/genres/' + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', genre.name);
    });

    it('Should return 404 if invalid id is passed', async () => {
      // Send a get request using the server object
      const res = await request(server).get('/api/genres/1');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    // Define the happy path, then in each test, change one parameter
    // the clearly aligns with the name of the test
    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: name });
    }

    beforeEach(() => {
      token = new User().generateToken();
      name = 'genre1';
    });

    it('Should return 401 if the user is not logged in', async () => {
      token = ' ';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('Should return 400 if genre is invalid', async () => {    
      name = 'g1';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Should return 400 if genre is more than 50 characters', async () => {
      name = new Array(52).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Should save the genre if it is valid', async () => {
      const res = await exec();
      const genre = Genre.find({ name: 'genre1' });
      expect(genre).not.toBeNull();
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });
});