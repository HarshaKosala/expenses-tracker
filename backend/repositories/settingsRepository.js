const Settings = require('../models/Settings');

class SettingsRepository {
  // Get or create settings
  async getSettings(userId) {
    try {
      return await Settings.getSettings(userId);
    } catch (error) {
      throw error;
    }
  }

  // Update settings
  async updateSettings(updateData, userId) {
    try {
      const settings = await Settings.getSettings(userId);
      Object.assign(settings, updateData);
      return await settings.save();
    } catch (error) {
      throw error;
    }
  }

  // Get monthly expense limit
  async getMonthlyLimit(userId) {
    try {
      const settings = await Settings.getSettings(userId);
      return settings.monthlyExpenseLimit;
    } catch (error) {
      throw error;
    }
  }

  // Update monthly expense limit
  async updateMonthlyLimit(limit, userId) {
    try {
      const settings = await Settings.getSettings(userId);
      settings.monthlyExpenseLimit = limit;
      return await settings.save();
    } catch (error) {
      throw error;
    }
  }

  // Get alert threshold
  async getAlertThreshold(userId) {
    try {
      const settings = await Settings.getSettings(userId);
      return settings.alertThreshold;
    } catch (error) {
      throw error;
    }
  }

  // Update alert threshold
  async updateAlertThreshold(threshold, userId) {
    try {
      const settings = await Settings.getSettings(userId);
      settings.alertThreshold = threshold;
      return await settings.save();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new SettingsRepository(); 