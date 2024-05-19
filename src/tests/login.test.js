const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');
const User = require('../models/users');

describe('POST /login', () => {
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
        .post('/login')
        .type('form')
        .send({
          username: 'ca',
          password: 'Password123'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('Username must be at least 3 characters long');
    });

    it('should return 400 if password is too short', async () => {
      const response = await request(app)
        .post('/login')
        .type('form')
        .send({
          username: 'carlos',
          password: 'Pass123'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('Password must be at least 8 characters long');
    });

    it('should return 400 if username is empty', async () => {
      const response = await request(app)
        .post('/login')
        .type('form')
        .send({
          username: '',
          password: 'Password123'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('Username cannot be empty');
    });

    it('should return 400 if request body has a missing field', async () => {
      const response = await request(app)
        .post('/login')
        .type('form')
        .send({
          password: 'Password123'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('Username is required');
    });

    it('should return 400 if any fields exceed the maximum character limit', async () => {
      const response = await request(app)
        .post('/login')
        .type('form')
        .send({
          username: 'a'.repeat(31),
          password: 'P'.repeat(61)
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('Username cannot exceed 30 characters');
      expect(response.text).toContain('Password cannot exceed 60 characters');
    });
  });

  describe('Login with invalid credentials', () => {
    beforeEach(async () => {
      const response = await request(app)
        .post('/signup')
        .type('form')
        .send({
          username: 'carlos',
          email: 'test@example.com',
          password: 'Password123',
          passwordConfirmation: 'Password123'
        });
    });

    it('should return 401 if username does not exist', async () => {
      const response = await request(app)
        .post('/login')
        .type('form')
        .send({
          username: 'randomusername',
          password: 'WrongPassword'
        });

      expect(response.status).toBe(401);
      expect(response.text).toContain('Invalid login credentials');
    });

    it('should return 401 if password is incorrect', async () => {
      const response = await request(app)
        .post('/login')
        .type('form')
        .send({
          username: 'carlos',
          password: 'WrongPassword'
        });

      expect(response.status).toBe(401);
      expect(response.text).toContain('Invalid login credentials');
    });
  });

  describe('Successful user login', () => {
    beforeEach(async () => {
      const response = await request(app)
        .post('/signup')
        .type('form')
        .send({
          username: 'carlos',
          email: 'test@example.com',
          password: 'Password123',
          passwordConfirmation: 'Password123'
        });
    });

    it('should login correctly and redirect to /home with status 302', async () => {
      const response = await request(app)
        .post('/login')
        .type('form')
        .send({
          username: 'carlos',
          password: 'Password123'
        });

      const redirectedUrl = response.header['location'];

      expect(response.status).toBe(302);
      expect(redirectedUrl).toMatch(/home/);
    });

    it('should include an accessToken cookie in the response headers', async () => {
      const response = await request(app)
        .post('/login')
        .type('form')
        .send({
          username: 'carlos',
          password: 'Password123'
        });

      expect(response.headers).toHaveProperty('set-cookie');

      const cookies = response.headers['set-cookie'];
      expect(cookies.length).toBeGreaterThan(0);

      const cookieValue = cookies[0].split(';')[0].split('=')[1];
      expect(cookieValue).toBeDefined();
    });
  });
});
