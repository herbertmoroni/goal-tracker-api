const healthRoutes = require('../../routes/healthRoutes');

describe('Health Routes', () => {
  it('should contain the correct routes', () => {
    // Get all routes from the router
    const routes = healthRoutes.stack
      .filter(layer => layer.route)
      .map(layer => ({
        path: layer.route.path,
        methods: Object.keys(layer.route.methods),
      }));
    
    // Check that the expected route exists
    expect(routes).toContainEqual({ path: '/', methods: ['get'] });
    
    // Verify number of routes
    expect(routes.length).toBe(1);
  });
  
  it('should have the correct handler for the root path', () => {
    // Get the handler function for the root path
    const rootRoute = healthRoutes.stack
      .find(layer => layer.route && layer.route.path === '/');
    
    // Verify the handler exists
    expect(rootRoute).toBeDefined();
    
    // Check the number of handlers (should just be the GET handler)
    expect(rootRoute.route.stack.length).toBe(1);
  });
});