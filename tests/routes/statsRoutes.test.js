const statsRoutes = require('../../routes/statsRoutes');
const statsController = require('../../controllers/statsController');
const { authenticate } = require('../../middleware/authMiddleware');

// Mock dependencies
jest.mock('../../controllers/statsController');
jest.mock('../../middleware/authMiddleware');
jest.mock('../../middleware/validation');

describe('Stats Routes', () => {
  it('should contain the correct routes', () => {
    // Get all routes from the router
    const routes = statsRoutes.stack
      .filter(layer => layer.route)
      .map(layer => ({
        path: layer.route.path,
        methods: Object.keys(layer.route.methods),
      }));
    
    // Check that all expected routes exist
    expect(routes).toContainEqual({ path: '/dashboard', methods: ['get'] });
    expect(routes).toContainEqual({ path: '/streaks', methods: ['get'] });
    expect(routes).toContainEqual({ path: '/scores', methods: ['get'] });
  });
  
  it('should use authentication middleware at router level', () => {
    // Check for use of authenticate middleware at router level
    const hasAuthMiddleware = statsRoutes.stack
      .some(layer => layer.handle === authenticate);
    
    expect(hasAuthMiddleware).toBe(true);
  });
});