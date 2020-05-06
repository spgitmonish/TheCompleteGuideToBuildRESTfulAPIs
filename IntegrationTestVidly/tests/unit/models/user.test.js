const {User} = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user.generateToken', () => {
  it('Should return a valid JWT token', () => {
    // Create a new user 
    const payload = { 
      _id: new mongoose.Types.ObjectId().toHexString(), 
      isAdmin: true
    };
    const user = new User(payload);
    const token = user.generateToken();
    const decoded = jwt.verify(token, config.get('jwtSecretPrivateKey'));
    expect(decoded).toMatchObject(payload);
  });
});