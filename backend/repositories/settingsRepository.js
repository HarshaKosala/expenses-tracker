const Settings = require('../models/Settings');

class SettingsRepository {
  async getUserSettings(userId) {
    try {
      return await Settings.getSettings(userId);
    } catch (error) {
      console.log('Error fetching user settings:', error.message);
      throw error;
    }
  }

  async updateUserSettings(updateData, userId) {
    try {
      const settings = await Settings.getSettings(userId);
      Object.assign(settings, updateData);
      return await settings.save();
    } catch (error) {
      console.log('Error updating user settings:', error.message);
      throw error;
    }
  }

  async getMonthlyLimit(userId) {
    try {
      const settings = await Settings.getSettings(userId);
      return settings.monthlyExpenseLimit;
    } catch (error) {
      console.log('Error fetching monthly limit:', error.message);
      throw error;
    }
  }

  async updateMonthlyLimit(limit, userId) {
    try {
      const settings = await Settings.getSettings(userId);
      settings.monthlyExpenseLimit = limit;
      return await settings.save();
    } catch (error) {
      console.log('Error updating monthly limit:', error.message);
      throw error;
    }
  }

  async getAlertThreshold(userId) {
    try {
      const settings = await Settings.getSettings(userId);
      return settings.alertThreshold;
    } catch (error) {
      console.log('Error fetching alert threshold:', error.message);
      throw error;
    }
  }

  async updateAlertThreshold(threshold, userId) {
    try {
      const settings = await Settings.getSettings(userId);
      settings.alertThreshold = threshold;
      return await settings.save();
    } catch (error) {
      console.log('Error updating alert threshold:', error.message);
      throw error;
    }
  }
}

module.exports = new SettingsRepository(); 