const swaggerJsdoc = require('swagger-jsdoc');

const getBaseUrl = () => {
  if (process.env.API_URL) {
    return process.env.API_URL;
  }
  
  if (process.env.NODE_ENV === 'production') {
    const domain = process.env.RAILWAY_STATIC_URL || 'https://api-expenses-tracker.up.railway.app';
    return domain;
  }
  
  return 'http://localhost:5001';
};

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Expense Tracker API',
      version: '1.0.0',
      description: 'API for personal expense tracking'
    },
    servers: [
      {
        url: getBaseUrl(),
        description: process.env.NODE_ENV === 'production' ? 'Production' : 'Development'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;
