const settingsRepository = require('../repositories/settingsRepository');

class SettingsService {
  // Get all settings
  async getSettings() {
    try {
      return await settingsRepository.getSettings();
    } catch (error) {
      throw error;
    }
  }

  // Update settings
  async updateSettings(updateData) {
    try {
      // Validate the update data
      const validationErrors = this.validateSettingsData(updateData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      return await settingsRepository.updateSettings(updateData);
    } catch (error) {
      throw error;
    }
  }

  // Get monthly expense limit
  async getMonthlyLimit() {
    try {
      return await settingsRepository.getMonthlyLimit();
    } catch (error) {
      throw error;
    }
  }

  // Update monthly expense limit
  async updateMonthlyLimit(limit) {
    try {
      // Validate the limit
      if (!limit || limit <= 0) {
        throw new Error('Monthly limit must be greater than 0');
      }

      return await settingsRepository.updateMonthlyLimit(limit);
    } catch (error) {
      throw error;
    }
  }

  // Get alert threshold
  async getAlertThreshold() {
    try {
      return await settingsRepository.getAlertThreshold();
    } catch (error) {
      throw error;
    }
  }

  // Update alert threshold
  async updateAlertThreshold(threshold) {
    try {
      // Validate the threshold
      if (threshold < 0 || threshold > 100) {
        throw new Error('Alert threshold must be between 0 and 100');
      }

      return await settingsRepository.updateAlertThreshold(threshold);
    } catch (error) {
      throw error;
    }
  }

  // Validate settings data
  validateSettingsData(settingsData) {
    const errors = [];

    if (settingsData.monthlyExpenseLimit !== undefined) {
      if (settingsData.monthlyExpenseLimit <= 0) {
        errors.push('Monthly expense limit must be greater than 0');
      }
    }

    if (settingsData.alertThreshold !== undefined) {
      if (settingsData.alertThreshold < 0 || settingsData.alertThreshold > 100) {
        errors.push('Alert threshold must be between 0 and 100');
      }
    }

    if (settingsData.currency !== undefined) {
      const validCurrencies = ['LKR', 'USD', 'EUR', 'GBP'];
      if (!validCurrencies.includes(settingsData.currency)) {
        errors.push('Invalid currency selected');
      }
    }

    return errors;
  }
}

module.exports = new SettingsService(); 