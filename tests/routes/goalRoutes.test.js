const goalRoutes = require('../../routes/goalRoutes');
const goalController = require('../../controllers/goalController');
const { authenticate } = require('../../middleware/authMiddleware');

// Mock dependencies
jest.mock('../../controllers/goalController');
jest.mock('../../middleware/authMiddleware');
jest.mock('../../middleware/validation');

describe('Goal Routes', () => {
  it('should contain the correct routes', () => {
    // Get all routes from the router
    const routes = goalRoutes.stack
      .filter(layer => layer.route)
      .map(layer => ({
        path: layer.route.path,
        methods: Object.keys(layer.route.methods),
      }));
    
    // Check that all expected routes exist
    expect(routes).toContainEqual({ path: '/', methods: ['get'] });
    expect(routes).toContainEqual({ path: '/', methods: ['post'] });
    expect(routes).toContainEqual({ path: '/:id', methods: ['get'] });
    expect(routes).toContainEqual({ path: '/:id', methods: ['put'] });
    expect(routes).toContainEqual({ path: '/:id', methods: ['delete'] });
    expect(routes).toContainEqual({ path: '/reorder', methods: ['patch'] });
  });
  
  it('should use authentication middleware at router level', () => {
    // Check for use of authenticate middleware at router level
    const hasAuthMiddleware = goalRoutes.stack
      .some(layer => layer.handle === authenticate);
    
    expect(hasAuthMiddleware).toBe(true);
  });
});