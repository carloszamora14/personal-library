const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');
const User = require('../models/users');

describe('POST /signup', () => {
  let mongoServer;

  beforeAll(async () => {
    await mongoose.disconnect();
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('Input validation errors', () => {
    it('should return 400 if username is too short', async () => {
      const response = await request(app)
        .post('/signup')
        .type('form')
        .send({
          username: 'ca',
          email: 'valid@mail.com',
          password: 'Password123',
          passwordConfirmation: 'Pass123'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('Username must be at least 3 characters long');
    });

    it('should return 400 if email is invalid', async () => {
      const response = await request(app)
        .post('/signup')
        .type('form')
        .send({
          username: 'carlos',
          email: 'invalidEmail',
          password: 'Password123',
          passwordConfirmation: 'Password123'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('Invalid email format');
    });

    it('should return 400 if password is too short', async () => {
      const response = await request(app)
        .post('/signup')
        .type('form')
        .send({
          username: 'carlos',
          email: 'valid@mail.com',
          password: 'Pass123',
          passwordConfirmation: 'Pass123'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('Password must be at least 8 characters long');
    });

    it('should return 400 if passwords do not match', async () => {
      const response = await request(app)
        .post('/signup')
        .type('form')
        .send({
          username: 'carlos',
          email: 'valid@mail.com',
          password: 'Password123',
          passwordConfirmation: 'Pass1234'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('Passwords must match');
    });

    it('should return 400 if username is empty', async () => {
      const response = await request(app)
        .post('/signup')
        .type('form')
        .send({
          username: '',
          email: 'valid@mail.com',
          password: 'Password123',
          passwordConfirmation: 'Password123'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('Username cannot be empty');
    });

    it('should return 400 if request body has missing field', async () => {
      const response = await request(app)
        .post('/signup')
        .type('form')
        .send({
          email: 'valid@mail.com',
          password: 'Password123'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('Username is required');
      expect(response.text).toContain('Password confirmation is required');
    });

    it('should return 400 if any fields exceed the maximum character limit', async () => {
      const response = await request(app)
        .post('/signup')
        .type('form')
        .send({
          username: 'a'.repeat(31),
          email: 'a'.repeat(256) + '@mail.com',
          password: 'P'.repeat(61),
          passwordConfirmation: 'P'.repeat(61)
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('Username cannot exceed 30 characters');
      expect(response.text).toContain('Email cannot exceed 255 characters');
      expect(response.text).toContain('Password cannot exceed 60 characters');
    });
  });
});
