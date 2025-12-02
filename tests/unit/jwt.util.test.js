import { jest } from '@jest/globals';
import { generateToken, verifyToken } from '../../src/utils/jwt.util.js';

describe('JWT Utils', () => {
  
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
  });
  
  it('should generate a token', () => {
    const token = generateToken('user123');
    
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });
  
  it('should verify a valid token', () => {
    const token = generateToken('user123');
    const decoded = verifyToken(token);
    
    expect(decoded.id).toBe('user123');
  });
  
  it('should throw error for invalid token', () => {
    expect(() => {
      verifyToken('invalid-token');
    }).toThrow();
  });
  
});