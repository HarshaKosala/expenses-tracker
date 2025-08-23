const settingsRepository = require('../repositories/settingsRepository');

class SettingsService {
  // Get all settings
  async getSettings(userId) {
    try {
      return await settingsRepository.getSettings(userId);
    } catch (error) {
      throw error;
    }
  }

  // Update settings
  async updateSettings(updateData, userId) {
    try {
      // Validate the update data
      const validationErrors = this.validateSettingsData(updateData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      return await settingsRepository.updateSettings(updateData, userId);
    } catch (error) {
      throw error;
    }
  }

  // Get monthly expense limit
  async getMonthlyLimit(userId) {
    try {
      return await settingsRepository.getMonthlyLimit(userId);
    } catch (error) {
      throw error;
    }
  }

  // Update monthly expense limit
  async updateMonthlyLimit(limit, userId) {
    try {
      // Validate the limit
      if (!limit || limit <= 0) {
        throw new Error('Monthly limit must be greater than 0');
      }

      return await settingsRepository.updateMonthlyLimit(limit, userId);
    } catch (error) {
      throw error;
    }
  }

  // Get alert threshold
  async getAlertThreshold(userId) {
    try {
      return await settingsRepository.getAlertThreshold(userId);
    } catch (error) {
      throw error;
    }
  }

  // Update alert threshold
  async updateAlertThreshold(threshold, userId) {
    try {
      // Validate the threshold
      if (threshold < 0 || threshold > 100) {
        throw new Error('Alert threshold must be between 0 and 100');
      }

      return await settingsRepository.updateAlertThreshold(threshold, userId);
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