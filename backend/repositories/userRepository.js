const User = require('../models/User');

class UserRepository {
  async createUser(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      console.log('Error creating user:', error.message);
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      console.log('Error finding user by email:', error.message);
      throw error;
    }
  }

  async findByUsername(username) {
    try {
      return await User.findOne({ username });
    } catch (error) {
      console.log('Error finding user by username:', error.message);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      return await User.findById(id).select('-password');
    } catch (error) {
      console.log('Error finding user by ID:', error.message);
      throw error;
    }
  }
}

module.exports = new UserRepository();
