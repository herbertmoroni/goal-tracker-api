const mongoose = require('mongoose');
const admin = require('firebase-admin');

describe('Server', () => {
  beforeAll(() => {
    // Set test environment
    process.env.NODE_ENV = 'test';
  });

  let app;

  beforeEach(() => {
    jest.resetModules();
    app = require('../server');
  });

  it('should have basic express properties', () => {
    expect(app).toBeDefined();
    expect(typeof app.use).toBe('function');
    expect(typeof app.get).toBe('function');
  });

  it('should have middleware configured', () => {
    // Check if app has routes and middleware
    expect(app._router).toBeDefined();
    expect(app._router.stack.length).toBeGreaterThan(0);
  });

  afterAll(async () => {
    // Close Mongoose connection if it's open
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    
    // Close Firebase Admin app
    try {
      const firebaseApps = admin.apps;
      if (firebaseApps.length > 0) {
        await Promise.all(firebaseApps.map(app => app.delete()));
      }
    } catch (err) {
      console.error('Error closing Firebase app:', err);
    }
    
    // Clear any remaining timeouts or intervals
    jest.useRealTimers();
  });
});