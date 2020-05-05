const lib = require('../lib');
const db = require('../db');
const mail = require('../mail');

// Grouping all the tests for testing absolute
describe('absolute', () => {
  // The tests should cover the number of execution paths
  it('Should return a positive number if input is positive', () => {
    const result = lib.absolute(1);
    expect(result).toBe(1);
  });
  
  it('Should return a positive number if input is negative', () => {
    const result = lib.absolute(-1);
    expect(result).toBe(1);
  });
  
  it('Should return a zero if input is zero', () => {
    const result = lib.absolute(0);
    expect(result).toBe(0);
  });
});

// Testing strings
describe('greet', () => {
  it('Should return a greeting', () => {
    const result = lib.greet('Monish');
    expect(result).toContain('Monish');
  });
});

// Testing arrays
describe('getCurrencies', () => {
  it('Should contain supported currencies', () => {
    const result = lib.getCurrencies();
    expect(result).toEqual(expect.arrayContaining(['USD', 'AUD', 'EUR']));
  });
});

// Testing objects
describe('getProduct', () => {
  const result = lib.getProduct(1);
  expect(result).toMatchObject({ 'id': 1, 'price': 10 });
  expect(result).toHaveProperty('id', 1);
});

// Testing exceptions
describe('registerUser', () => {
  it('Should throw error if username if falsy', () => { 
    const args = [null, undefined, NaN, 0, false];
    args.forEach(a => {
      expect(() => { lib.registerUser(null) }).toThrow();
    });
  });
  
  it('Should return an object if the username is valid', () => { 
    const result = lib.registerUser('Monish');
    expect(result).toMatchObject({ username: 'Monish' });
    expect(result.id).toBeGreaterThan(0);
  });
});

// Testing using mock functions
describe('applyDiscount', () => {
  it('Should apply a discount of 10% on the order if the customer has more than 10 points', () => {
    db.getCustomerSync = function(id) {
      return { id: id, points: 20 };
    };
    
    // Use the mock function above to simulate reading from database
    const order = { customerId: 1, totalPrice: 10 };
    lib.applyDiscount(order);
    expect(order.totalPrice).toBe(9);
  });
});

// Testing using jest mock functions
describe('notifyCustomer', () => {
  it('Should send an email to the customer', () => {
    db.getCustomerSync = jest.fn().mockReturnValue({ email: 'test@email.com' });
    mail.send = jest.fn();

    lib.notifyCustomer({ customerId: 1 });

    expect(mail.send).toHaveBeenCalled();
    expect(mail.send.mock.calls[0][0]).toBe('test@email.com');
    expect(mail.send.mock.calls[0][1]).toMatch(/order/);
  });
});