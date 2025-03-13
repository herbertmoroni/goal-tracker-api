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
      {  url: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : 'https://goal-tracker-api-1mgp.onrender.com/api' }
    ],
    tags: [
      { name: 'Users', description: 'User operations' },
      { name: 'Goals', description: 'Goal management operations' },
      { name: 'Checks', description: 'Goal completion checks' },
      { name: 'Stats', description: 'Statistics and reporting' },
      { name: 'System', description: 'System operations' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: []
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