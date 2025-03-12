const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Goal Tracker API',
      version: '1.0.0',
      description: 'A RESTful API for tracking personal goals and habits'
    },
    servers: [
      { url: 'http://localhost:3000/api', description: 'Development server' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: [path.join(__dirname, '..', 'routes', '*.js')]
};

const specs = swaggerJsdoc(options);

module.exports = { 
  serve: swaggerUi.serve, 
  setup: swaggerUi.setup(specs)
};