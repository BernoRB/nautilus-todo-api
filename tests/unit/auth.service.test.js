import authService from '../../src/services/auth.service.js';
import { connectDB, clearDB, closeDB } from '../setup.js';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await closeDB();
});

describe('Auth Service', () => {
  
  it('should register a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };
    
    const result = await authService.register(userData);
    
    expect(result.token).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
    expect(result.user.name).toBe('Test User');
  });
  
  it('should throw error if email exists', async () => {
    const userData = {
      email: 'duplicate@example.com',
      password: 'password123',
      name: 'User'
    };
    
    await authService.register(userData);
    
    await expect(
      authService.register(userData)
    ).rejects.toThrow('Email already registered');
  });
  
  it('should login with valid credentials', async () => {
    await authService.register({
      email: 'login@example.com',
      password: 'password123',
      name: 'User'
    });
    
    const result = await authService.login('login@example.com', 'password123');
    
    expect(result.token).toBeDefined();
    expect(result.user.email).toBe('login@example.com');
  });
  
});