const categoryRoutes = require('../../routes/categoryRoutes');
const categoryController = require('../../controllers/categoryController');
const { authenticate } = require('../../middleware/authMiddleware');

// Mock dependencies
jest.mock('../../controllers/categoryController');
jest.mock('../../middleware/authMiddleware');
jest.mock('../../middleware/validation');

describe('Category Routes', () => {
  it('should contain the correct routes', () => {
    // Get all routes from the router
    const routes = categoryRoutes.stack
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
  });
  
  it('should use authentication middleware', () => {
    // Check for use of authenticate middleware at router level
    const hasAuthMiddleware = categoryRoutes.stack
      .some(layer => layer.handle === authenticate);
    
    expect(hasAuthMiddleware).toBe(true);
  });
});