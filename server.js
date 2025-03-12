const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./docs/swagger');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes with prefix
app.use('/api', require('./routes'));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerDocs.setup);

// Base route redirect to API docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at: `);
  console.log(`➜ Local: \x1b[34mhttp://localhost:${PORT}\x1b[0m`);
  console.log(`➜ API Docs: \x1b[34mhttp://localhost:${PORT}/api-docs\x1b[0m`);
  console.log(`➜ Press \x1b[33mCTRL+C\x1b[0m to stop the server`);
});

module.exports = app; // For testing