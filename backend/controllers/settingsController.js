const settingsService = require('../services/settingsService');
const { validationResult } = require('express-validator');

class SettingsController {
  async getSettings(req, res) {
    try {
      const settings = await settingsService.getUserSettings(req.user._id);
      
      res.json({
        success: true,
        message: 'Settings retrieved successfully',
        data: settings
      });
    } catch (error) {
      console.error('Get settings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve settings',
        error: error.message
      });
    }
  }

  async updateSettings(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const updateData = req.body;
      const settings = await settingsService.updateUserSettings(updateData, req.user._id);
      
      res.json({
        success: true,
        message: 'Settings updated successfully',
        data: settings
      });
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update settings',
        error: error.message
      });
    }
  }

  // Get monthly expense limit
  async getMonthlyLimit(req, res) {
    try {
      const limit = await settingsService.getMonthlyLimit(req.user._id);
      
      res.json({
        success: true,
        message: 'Monthly limit retrieved successfully',
        data: { monthlyExpenseLimit: limit }
      });
    } catch (error) {
      console.error('Get monthly limit error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve monthly limit',
        error: error.message
      });
    }
  }

  // Update monthly expense limit
  async updateMonthlyLimit(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { monthlyExpenseLimit } = req.body;
      const settings = await settingsService.updateMonthlyLimit(monthlyExpenseLimit, req.user._id);
      
      res.json({
        success: true,
        message: 'Monthly limit updated successfully',
        data: settings
      });
    } catch (error) {
      console.error('Update monthly limit error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update monthly limit',
        error: error.message
      });
    }
  }

  // Get alert threshold
  async getAlertThreshold(req, res) {
    try {
      const threshold = await settingsService.getAlertThreshold(req.user._id);
      
      res.json({
        success: true,
        message: 'Alert threshold retrieved successfully',
        data: { alertThreshold: threshold }
      });
    } catch (error) {
      console.error('Get alert threshold error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve alert threshold',
        error: error.message
      });
    }
  }

  // Update alert threshold
  async updateAlertThreshold(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { alertThreshold } = req.body;
      const settings = await settingsService.updateAlertThreshold(alertThreshold, req.user._id);
      
      res.json({
        success: true,
        message: 'Alert threshold updated successfully',
        data: settings
      });
    } catch (error) {
      console.error('Update alert threshold error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update alert threshold',
        error: error.message
      });
    }
  }
}

module.exports = new SettingsController(); 