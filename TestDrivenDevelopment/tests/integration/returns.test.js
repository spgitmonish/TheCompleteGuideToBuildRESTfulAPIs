const request = require('supertest');
const moment = require('moment');
const {Rental} = require('../../models/rental');
const {User} = require('../../models/user');
const {Movie} = require('../../models/movie');
let server;

describe('/api/rentals', () => {
  // Start and stop the server before test suit
  beforeEach(() => { server = require('../../index'); });
  afterEach(async () => { 
    await Rental.remove({});
    await Movie.remove({});
    await server.close();
  });

  let rental;
  let customerName;
  let movieTitle;
  let movie;
  let token;

  const exec = async () => {
    return await request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerName, movieTitle });
  }

  // Before each of the test cases
  beforeEach(async () => {
    // Generate variable values
    customerName = "12345";
    movieTitle = "12345";
    token = new User().generateToken();

    movie = new Movie({
      title: "12345",
      genre: {name: "test"},
      dailyRentalRate: 2,
      numberInStock: 10
    });
    await movie.save();

    // Generate a rental to be saved
    rental = new Rental({
      customer: {
        name: "12345",
        phone: "12345"
      },
      movie: { 
        title: "12345",
        dailyRentalRate: 2
      }
    });

    await rental.save();
  });

  it('Should return 401 if the client is not logged in', async () => {
    token = ' ';
    
    const res = await exec();
    
    expect(res.status).toBe(401);
  });

  it('Should return 400 if the customerName is not specified', async () => {
    customerName = '';
    
    const res = await exec();
    
    expect(res.status).toBe(400);
  });

  it('Should return 400 if the movieTitle is not specified', async () => {
    movieTitle = '';
    
    const res = await exec();
    
    expect(res.status).toBe(400);
  });

  it('Should return 404 if no rental found for the customer/movie combination', async () => {
    await Rental.remove({});
    
    const res = await exec();
    
    expect(res.status).toBe(404);
  });

  it('Should return 400 if return is already processed', async () => {
    rental.dateReturned = new Date();    
    await rental.save();
    
    const res = await exec();
    
    expect(res.status).toBe(400);
  });

  it('Should set the return date if it is a valid request', async () => {
    await exec();
    
    const rentalInDb = await Rental.findById(rental._id);
    const diff = rentalInDb.dateReturned - new Date();
    expect(diff).toBeLessThan(10 * 1000);
  });

  it('Should calculate a valid rental fee if it is a valid request', async () => {
    const numberOfDays = 7
    rental.dateRented = moment().add(-numberOfDays, 'days').toDate();
    await rental.save();
    
    await exec();
    
    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(numberOfDays * rentalInDb.movie.dailyRentalRate);
  });

  it('Should increase the movie stock by 1 if it is a valid request', async () => {
    const numberInStock = movie.numberInStock;

    await exec();
    
    const movieInDb = await Movie.findOne({ title: movie.title });
    expect(movieInDb.numberInStock).toBe(numberInStock + 1);
  });

  it('Should return 200 if it is a valid request', async () => {
    const res = await exec();
    
    expect(res.status).toBe(200);
  });

  it('Should return the rental if input is valid', async () => {
    const res = await exec();
    
    const rentalInDb = await Rental.findById(rental._id);
    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining(['dateReturned', 'rentalFee', 'dateRented', 'customer', 'movie'])
    );
  });
});