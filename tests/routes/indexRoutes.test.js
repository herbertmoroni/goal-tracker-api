const express = require('express');

// Create mock routers before mocking the modules
const mockAuthRouter = express.Router();
const mockCategoryRouter = express.Router();
const mockGoalRouter = express.Router();
const mockCheckRouter = express.Router();
const mockStatsRouter = express.Router();
const mockHealthRouter = express.Router();

// Mock dependencies - return actual router objects
jest.mock('../../routes/authRoutes', () => mockAuthRouter);
jest.mock('../../routes/categoryRoutes', () => mockCategoryRouter);
jest.mock('../../routes/goalRoutes', () => mockGoalRouter);
jest.mock('../../routes/checkRoutes', () => mockCheckRouter);
jest.mock('../../routes/statsRoutes', () => mockStatsRouter);
jest.mock('../../routes/healthRoutes', () => mockHealthRouter);

// Now require the index route AFTER mocking
const indexRoutes = require('../../routes/index');

describe('Index Routes', () => {
  it('should register all route modules with correct paths', () => {
    // Get all the router uses from the stack
    const registeredRoutes = indexRoutes.stack
      .filter(layer => layer.name === 'router')
      .map(layer => ({
        path: layer.regexp.toString().match(/^\/\^\\(\/?[^\\]*)/)[1],
        handler: layer.handle
      }));
    
    // Check all routes are registered with correct paths
    expect(registeredRoutes).toContainEqual(
      expect.objectContaining({ path: '/auth' })
    );
    expect(registeredRoutes).toContainEqual(
      expect.objectContaining({ path: '/categories' })
    );
    expect(registeredRoutes).toContainEqual(
      expect.objectContaining({ path: '/goals' })
    );
    expect(registeredRoutes).toContainEqual(
      expect.objectContaining({ path: '/checks' })
    );
    expect(registeredRoutes).toContainEqual(
      expect.objectContaining({ path: '/stats' })
    );
    expect(registeredRoutes).toContainEqual(
      expect.objectContaining({ path: '/health' })
    );
    
    // Verify number of routes
    expect(registeredRoutes.length).toBe(6);
  });
});