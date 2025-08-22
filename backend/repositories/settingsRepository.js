const Settings = require('../models/Settings');

class SettingsRepository {
  // Get or create settings
  async getSettings() {
    try {
      return await Settings.getSettings();
    } catch (error) {
      throw error;
    }
  }

  // Update settings
  async updateSettings(updateData) {
    try {
      const settings = await Settings.getSettings();
      Object.assign(settings, updateData);
      return await settings.save();
    } catch (error) {
      throw error;
    }
  }

  // Get monthly expense limit
  async getMonthlyLimit() {
    try {
      const settings = await Settings.getSettings();
      return settings.monthlyExpenseLimit;
    } catch (error) {
      throw error;
    }
  }

  // Update monthly expense limit
  async updateMonthlyLimit(limit) {
    try {
      const settings = await Settings.getSettings();
      settings.monthlyExpenseLimit = limit;
      return await settings.save();
    } catch (error) {
      throw error;
    }
  }

  // Get alert threshold
  async getAlertThreshold() {
    try {
      const settings = await Settings.getSettings();
      return settings.alertThreshold;
    } catch (error) {
      throw error;
    }
  }

  // Update alert threshold
  async updateAlertThreshold(threshold) {
    try {
      const settings = await Settings.getSettings();
      settings.alertThreshold = threshold;
      return await settings.save();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new SettingsRepository(); 