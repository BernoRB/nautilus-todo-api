import request from 'supertest';
import app from '../../src/app.js';
import { connectDB, clearDB, closeDB } from '../setup.js';

// Connect to test database before all tests
beforeAll(async () => {
  await connectDB();
});

// Clear database after each test
afterEach(async () => {
  await clearDB();
});

// Close database after all tests
afterAll(async () => {
  await closeDB();
});

describe('Auth Endpoints', () => {
  
  describe('POST /api/auth/register', () => {
    
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.data.user).toHaveProperty('name', 'Test User');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).not.toHaveProperty('password');
    });
    
    it('should not register user with duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };
      
      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send(userData);
      
      // Try to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email already registered');
    });
    
    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
      expect(response.body.errors).toBeInstanceOf(Array);
    });
    
    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: 'Test User'
        })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: 'Please provide a valid email'
          })
        ])
      );
    });
    
    it('should validate password length', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: '123',
          name: 'Test User'
        })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'password',
            message: 'Password must be at least 6 characters'
          })
        ])
      );
    });
    
  });
  
  describe('POST /api/auth/login', () => {
    
    it('should login user successfully', async () => {
      // First register a user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        });
      
      // Then login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('email', 'test@example.com');
    });
    
    it('should not login with wrong password', async () => {
      // Register user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        });
      
      // Try login with wrong password
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });
    
    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'notfound@example.com',
          password: 'password123'
        })
        .expect(401);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });
    
    it('should validate login fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
    });
    
  });
  
});