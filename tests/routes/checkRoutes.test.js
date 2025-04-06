const checkRoutes = require('../../routes/checkRoutes');
const checkController = require('../../controllers/checkController');
const { authenticate } = require('../../middleware/authMiddleware');

// Mock dependencies
jest.mock('../../controllers/checkController');
jest.mock('../../middleware/authMiddleware');
jest.mock('../../middleware/validation');

describe('Check Routes', () => {
  it('should contain the correct routes', () => {
    // Get all routes from the router
    const routes = checkRoutes.stack
      .filter(layer => layer.route)
      .map(layer => ({
        path: layer.route.path,
        methods: Object.keys(layer.route.methods),
      }));
    
    // Check that all expected routes exist
    expect(routes).toContainEqual({ path: '/week', methods: ['get'] });
    expect(routes).toContainEqual({ path: '/:goalId/:date', methods: ['post'] });
    expect(routes).toContainEqual({ path: '/date/:date', methods: ['get'] });
    expect(routes).toContainEqual({ path: '/:id', methods: ['delete'] });
  });
  
  it('should use authentication middleware at router level', () => {
    // Check for use of authenticate middleware at router level
    const hasAuthMiddleware = checkRoutes.stack
      .some(layer => layer.handle === authenticate);
    
    expect(hasAuthMiddleware).toBe(true);
  });
});