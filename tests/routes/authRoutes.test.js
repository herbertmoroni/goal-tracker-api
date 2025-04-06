const authRoutes = require('../../routes/authRoutes');
const authController = require('../../controllers/authController');
const { authenticate } = require('../../middleware/authMiddleware');

// Mock dependencies
jest.mock('../../controllers/authController');
jest.mock('../../middleware/authMiddleware');
jest.mock('../../middleware/validation');

describe('Auth Routes', () => {
  it('should contain the correct routes', () => {
    // Get all routes from the router
    const routes = authRoutes.stack
      .filter(layer => layer.route)
      .map(layer => ({
        path: layer.route.path,
        methods: Object.keys(layer.route.methods),
      }));
    
    // Check that all expected routes exist
    expect(routes).toContainEqual({ path: '/register', methods: ['post'] });
    expect(routes).toContainEqual({ path: '/login', methods: ['post'] });
    expect(routes).toContainEqual({ path: '/user', methods: ['get'] });
    expect(routes).toContainEqual({ path: '/user', methods: ['put'] });
    expect(routes).toContainEqual({ path: '/user', methods: ['delete'] });
  });
  
  it('should have public and protected routes', () => {
    // Get all routes with their middleware
    const routeMiddleware = authRoutes.stack
      .filter(layer => layer.route)
      .map(layer => ({
        path: layer.route.path,
        method: Object.keys(layer.route.methods)[0],
        hasAuthMiddleware: layer.route.stack.some(handler => handler.handle === authenticate)
      }));
    
    // Public routes should not have auth middleware
    const registerRoute = routeMiddleware.find(r => r.path === '/register' && r.method === 'post');
    const loginRoute = routeMiddleware.find(r => r.path === '/login' && r.method === 'post');
    
    expect(registerRoute.hasAuthMiddleware).toBe(false);
    expect(loginRoute.hasAuthMiddleware).toBe(false);
    
    // Protected routes should have auth middleware
    const userGetRoute = routeMiddleware.find(r => r.path === '/user' && r.method === 'get');
    const userPutRoute = routeMiddleware.find(r => r.path === '/user' && r.method === 'put');
    const userDeleteRoute = routeMiddleware.find(r => r.path === '/user' && r.method === 'delete');
    
    expect(userGetRoute.hasAuthMiddleware).toBe(true);
    expect(userPutRoute.hasAuthMiddleware).toBe(true);
    expect(userDeleteRoute.hasAuthMiddleware).toBe(true);
  });
});