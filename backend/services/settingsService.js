const settingsRepository = require('../repositories/settingsRepository');

class SettingsService {
  async getUserSettings(userId) {
    try {
      return await settingsRepository.getUserSettings(userId);
    } catch (error) {
      console.log('Error in getUserSettings service:', error.message);
      throw error;
    }
  }

  async updateUserSettings(updateData, userId) {
    try {
      const validationErrors = this.validateSettingsData(updateData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const result = await settingsRepository.updateUserSettings(updateData, userId);
      console.log(`Settings updated for user ${userId}`);
      return result;
    } catch (error) {
      console.log('Error in updateUserSettings service:', error.message);
      throw error;
    }
  }

  async getMonthlyLimit(userId) {
    try {
      return await settingsRepository.getMonthlyLimit(userId);
    } catch (error) {
      console.log('Error in getMonthlyLimit service:', error.message);
      throw error;
    }
  }

  async updateMonthlyLimit(limit, userId) {
    try {
      if (!limit || limit <= 0) {
        throw new Error('Monthly limit must be greater than 0');
      }

      const result = await settingsRepository.updateMonthlyLimit(limit, userId);
      console.log(`Monthly limit updated for user ${userId}: ${limit}`);
      return result;
    } catch (error) {
      console.log('Error in updateMonthlyLimit service:', error.message);
      throw error;
    }
  }

  async getAlertThreshold(userId) {
    try {
      return await settingsRepository.getAlertThreshold(userId);
    } catch (error) {
      console.log('Error in getAlertThreshold service:', error.message);
      throw error;
    }
  }

  async updateAlertThreshold(threshold, userId) {
    try {
      if (threshold < 0 || threshold > 100) {
        throw new Error('Alert threshold must be between 0 and 100');
      }

      const result = await settingsRepository.updateAlertThreshold(threshold, userId);
      console.log(`Alert threshold updated for user ${userId}: ${threshold}%`);
      return result;
    } catch (error) {
      console.log('Error in updateAlertThreshold service:', error.message);
      throw error;
    }
  }

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