const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

class AuthService {
  async register(userData) {
    const { username, email, password } = userData;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await userRepository.createUser({
      username,
      email,
      password: hashedPassword
    });

    const token = this.generateToken(user._id);

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token
    };
  }

  async login(credentials) {
    const { email, password } = credentials;

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user._id);

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token
    };
  }

  generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
  }
}

module.exports = new AuthService();
