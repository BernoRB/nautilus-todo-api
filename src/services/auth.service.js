import User from '../models/User.model.js';
import { generateToken } from '../utils/jwt.util.js';

class AuthService {
  async register(userData) {
    // Check already registered
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      const error = new Error('Email already registered');
      error.status = 400;
      throw error;
    }

    // Create user
    const user = await User.create(userData);

    // Generate token
    const token = generateToken(user._id);

    // Return registered user
    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      token
    };
  }

  async login(email, password) {
    // Search user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    // Login ok: generate token
    const token = generateToken(user._id);

    // Return user & token
    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      token
    };
  }
}

export default new AuthService();