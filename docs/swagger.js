const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 3000;

// Common response schemas to reduce repetition
const responses = {
  success: (schema) => ({
    description: 'Successful operation',
    content: {
      'application/json': { schema }
    }
  }),
  error: (description = 'Error') => ({
    description,
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error'
        }
      }
    }
  })
};

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Goal Tracker API',
      version: '1.0.0',
      description: 'A RESTful API for tracking personal goals and habits'
    },
    servers: [
      { url: process.env.NODE_ENV === 'development' ? `http://localhost:${PORT}/api` : 'https://goal-tracker-api-1mgp.onrender.com/api' }
    ],
    tags: [
      { name: 'Users', description: 'User operations' },
      { name: 'Categories', description: 'Category management operations' },
      { name: 'Goals', description: 'Goal management operations' },
      { name: 'Checks', description: 'Goal completion checks' },
      { name: 'Stats', description: 'Statistics and reporting' },
      { name: 'System', description: 'System operations' }
    ],
    components: {
      schemas: {
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', format: 'password', example: 'StrongPassword123!' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string', example: 'Login successful' },
            tokenType: { type: 'string', example: 'Bearer' },
            token: { type: 'string', example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...' },
            usage: { type: 'string', example: 'Add this token to the Authorize button in Swagger' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' }
              }
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '5f8d0f55e3a9d93f9810c9a1' },
            firebaseUid: { type: 'string', example: 'firebase123' },
            displayName: { type: 'string', example: 'Chuck Norris' },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            createdAt: { type: 'string', format: 'date-time' },
            lastLogin: { type: 'string', format: 'date-time' }
          }
        },
        UserInput: {
          type: 'object',
          required: ['email', 'password', 'displayName'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', format: 'password', example: 'StrongPassword123!' },
            displayName: { type: 'string', example: 'Chuck Norris' }
          }
        },
        UserResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' }
              }
            }
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '60a1b2c3d4e5f6g7h8i9j0k1' },
            userId: { type: 'string', example: '5f8d0f55e3a9d93f9810c9a1' },
            name: { type: 'string', example: 'Physical Health' },
            color: { type: 'string', example: '#3498db' },
            order: { type: 'number', example: 1 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CategoryInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Physical Health' },
            color: { type: 'string', example: '#3498db' }
          }
        },
        CategoryResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: {
              type: 'object',
              properties: {
                category: { $ref: '#/components/schemas/Category' }
              }
            }
          }
        },
        CategoriesResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: {
              type: 'object',
              properties: {
                categories: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Category' }
                }
              }
            }
          }
        },
        Goal: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '60a1b2c3d4e5f6g7h8i9j0k1' },
            userId: { type: 'string', example: '5f8d0f55e3a9d93f9810c9a1' },
            name: { type: 'string', example: 'Exercise daily' },
            iconType: { type: 'string', example: 'fitness' },
            positive: { type: 'boolean', example: true },
            points: { type: 'number', example: 10 },
            order: { type: 'number', example: 1 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        GoalInput: {
          type: 'object',
          required: ['name', 'iconType', 'positive', 'points'],
          properties: {
            name: { type: 'string', example: 'Exercise daily' },
            iconType: { type: 'string', example: 'fitness' },
            positive: { type: 'boolean', example: true },
            points: { type: 'number', example: 10 }
          }
        },
        GoalResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: {
              type: 'object',
              properties: {
                goal: { $ref: '#/components/schemas/Goal' }
              }
            }
          }
        },
        GoalsResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: {
              type: 'object',
              properties: {
                goals: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Goal' }
                }
              }
            }
          }
        },
        Check: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '60a1b2c3d4e5f6g7h8i9j0k1' },
            goalId: { type: 'string', example: '60a1b2c3d4e5f6g7h8i9j0k1' },
            userId: { type: 'string', example: '5f8d0f55e3a9d93f9810c9a1' },
            date: { type: 'string', format: 'date', example: '2023-03-15' },
            completed: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        CheckResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: {
              type: 'object',
              properties: {
                check: { $ref: '#/components/schemas/Check' }
              }
            }
          }
        },
        ChecksResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: {
              type: 'object',
              properties: {
                checks: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Check' }
                }
              }
            }
          }
        },
        Stat: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '60a1b2c3d4e5f6g7h8i9j0k1' },
            userId: { type: 'string', example: '5f8d0f55e3a9d93f9810c9a1' },
            date: { type: 'string', format: 'date', example: '2023-03-15' },
            type: { type: 'string', enum: ['daily', 'streak'], example: 'daily' },
            value: { type: 'number', example: 85 },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        DashboardStats: {
          type: 'object',
          properties: {
            totalGoals: { type: 'number', example: 12 },
            activeGoals: { type: 'number', example: 10 },
            streakData: {
              type: 'object',
              properties: {
                currentStreak: { type: 'number', example: 7 },
                longestStreak: { type: 'number', example: 21 }
              }
            },
            completionRate: { type: 'number', example: 85.5 }
          }
        },
        StatsResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: {
              type: 'object',
              properties: {
                stats: { $ref: '#/components/schemas/DashboardStats' }
              }
            }
          }
        },
        StreakResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: {
              type: 'object',
              properties: {
                streaks: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      goalId: { type: 'string', example: '60a1b2c3d4e5f6g7h8i9j0k1' },
                      goalName: { type: 'string', example: 'Exercise daily' },
                      currentStreak: { type: 'number', example: 5 },
                      longestStreak: { type: 'number', example: 14 }
                    }
                  }
                }
              }
            }
          }
        },
        ScoresResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: {
              type: 'object',
              properties: {
                dateRange: {
                  type: 'object',
                  properties: {
                    start: { type: 'string', format: 'date', example: '2023-03-01' },
                    end: { type: 'string', format: 'date', example: '2023-03-15' }
                  }
                },
                scores: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      date: { type: 'string', format: 'date', example: '2023-03-15' },
                      value: { type: 'number', example: 85 },
                      completedCount: { type: 'number', example: 3 },
                      totalCount: { type: 'number', example: 5 }
                    }
                  }
                }
              }
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string', example: 'API is operational' },
            version: { type: 'string', example: '1.0.0' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Error message details' }
          }
        }
      },
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }],
    paths: {
      // Auth Routes
      '/auth/login': {
        post: {
          summary: 'Login user (for testing with Swagger)',
          tags: ['Users'],
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginInput' }
              }
            }
          },
          responses: {
            200: responses.success({ $ref: '#/components/schemas/LoginResponse' }),
            400: responses.error('Invalid input'),
            401: responses.error('Invalid credentials')
          }
        }
      },
      '/auth/register': {
        post: {
          summary: 'Register a new user',
          tags: ['Users'],
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserInput' }
              }
            }
          },
          responses: {
            201: responses.success({ $ref: '#/components/schemas/UserResponse' }),
            400: responses.error('Invalid input'),
            409: responses.error('User already exists')
          }
        }
      },
      '/auth/user': {
        get: {
          summary: 'Get current user information',
          tags: ['Users'],
          responses: {
            200: responses.success({ $ref: '#/components/schemas/UserResponse' }),
            401: responses.error('Unauthorized')
          }
        },
        put: {
          summary: 'Update user display name',
          tags: ['Users'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['displayName'],
                  properties: {
                    displayName: { type: 'string', example: 'New Display Name' }
                  }
                }
              }
            }
          },
          responses: {
            200: responses.success({ $ref: '#/components/schemas/UserResponse' }),
            400: responses.error('Invalid input'),
            401: responses.error('Unauthorized'),
            404: responses.error('User not found')
          }
        },
        delete: {
          summary: 'Delete user account and all associated data',
          tags: ['Users'],
          responses: {
            200: responses.success({
              type: 'object',
              properties: {
                status: { type: 'string', example: 'success' },
                message: { type: 'string', example: 'User and all associated data deleted successfully' }
              }
            }),
            401: responses.error('Unauthorized'),
            404: responses.error('User not found')
          }
        }
      },
      // Categories Routes
      '/categories': {
        get: {
          summary: 'Get all categories for the current user',
          tags: ['Categories'],
          responses: {
            200: responses.success({ $ref: '#/components/schemas/CategoriesResponse' }),
            401: responses.error('Unauthorized')
          }
        },
        post: {
          summary: 'Create a new category',
          tags: ['Categories'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CategoryInput' }
              }
            }
          },
          responses: {
            201: responses.success({ $ref: '#/components/schemas/CategoryResponse' }),
            400: responses.error('Invalid input'),
            401: responses.error('Unauthorized')
          }
        }
      },
      '/categories/{id}': {
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Category ID'
          }
        ],
        get: {
          summary: 'Get a specific category by ID',
          tags: ['Categories'],
          responses: {
            200: responses.success({ $ref: '#/components/schemas/CategoryResponse' }),
            401: responses.error('Unauthorized'),
            404: responses.error('Category not found')
          }
        },
        put: {
          summary: 'Update a category',
          tags: ['Categories'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CategoryInput' }
              }
            }
          },
          responses: {
            200: responses.success({ $ref: '#/components/schemas/CategoryResponse' }),
            400: responses.error('Invalid input'),
            401: responses.error('Unauthorized'),
            404: responses.error('Category not found')
          }
        },
        delete: {
          summary: 'Delete a category',
          tags: ['Categories'],
          responses: {
            200: responses.success({
              type: 'object',
              properties: {
                status: { type: 'string', example: 'success' },
                message: { type: 'string', example: 'Category deleted successfully' },
                affectedGoals: { type: 'number', example: 3 }
              }
            }),
            401: responses.error('Unauthorized'),
            404: responses.error('Category not found')
          }
        }
      },
      // Goal Routes
      '/goals': {
        get: {
          summary: 'Get all goals for the current user',
          tags: ['Goals'],
          responses: {
            200: responses.success({ $ref: '#/components/schemas/GoalsResponse' }),
            401: responses.error('Unauthorized')
          }
        },
        post: {
          summary: 'Create a new goal',
          tags: ['Goals'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/GoalInput' }
              }
            }
          },
          responses: {
            201: responses.success({ $ref: '#/components/schemas/GoalResponse' }),
            400: responses.error('Invalid input'),
            401: responses.error('Unauthorized')
          }
        }
      },
      '/goals/{id}': {
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Goal ID'
          }
        ],
        get: {
          summary: 'Get a specific goal by ID',
          tags: ['Goals'],
          responses: {
            200: responses.success({ $ref: '#/components/schemas/GoalResponse' }),
            401: responses.error('Unauthorized'),
            404: responses.error('Goal not found')
          }
        },
        put: {
          summary: 'Update a goal',
          tags: ['Goals'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/GoalInput' }
              }
            }
          },
          responses: {
            200: responses.success({ $ref: '#/components/schemas/GoalResponse' }),
            400: responses.error('Invalid input'),
            401: responses.error('Unauthorized'),
            404: responses.error('Goal not found')
          }
        },
        delete: {
          summary: 'Delete a goal',
          tags: ['Goals'],
          responses: {
            200: responses.success({
              type: 'object',
              properties: {
                status: { type: 'string', example: 'success' },
                message: { type: 'string', example: 'Goal deleted successfully' }
              }
            }),
            401: responses.error('Unauthorized'),
            404: responses.error('Goal not found')
          }
        }
      },
      '/goals/reorder': {
        patch: {
          summary: 'Reorder goals',
          tags: ['Goals'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['goals'],
                  properties: {
                    goals: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['id', 'order'],
                        properties: {
                          id: { type: 'string' },
                          order: { type: 'number' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: responses.success({
              type: 'object',
              properties: {
                status: { type: 'string', example: 'success' },
                message: { type: 'string', example: 'Goals reordered successfully' }
              }
            }),
            400: responses.error('Invalid input'),
            401: responses.error('Unauthorized')
          }
        }
      },
      
      // Check Routes
      '/checks/week': {
        get: {
          summary: 'Get checks for the current week',
          tags: ['Checks'],
          responses: {
            200: responses.success({ $ref: '#/components/schemas/ChecksResponse' }),
            401: responses.error('Unauthorized')
          }
        }
      },
      '/checks/{goalId}/{date}': {
        parameters: [
          {
            name: 'goalId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Goal ID'
          },
          {
            name: 'date',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'date' },
            description: 'Date in YYYY-MM-DD format'
          }
        ],
        post: {
          summary: 'Toggle completion status for a goal on a specific date',
          tags: ['Checks'],
          responses: {
            200: responses.success({ $ref: '#/components/schemas/CheckResponse' }),
            401: responses.error('Unauthorized'),
            404: responses.error('Goal not found')
          }
        }
      },
      '/checks/date/{date}': {
        parameters: [
          {
            name: 'date',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'date' },
            description: 'Date in YYYY-MM-DD format'
          }
        ],
        get: {
          summary: 'Get checks for a specific date',
          tags: ['Checks'],
          responses: {
            200: responses.success({ $ref: '#/components/schemas/ChecksResponse' }),
            401: responses.error('Unauthorized')
          }
        }
      },
      '/checks/{id}': {
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Check ID'
            }
          ],
          delete: {
            summary: 'Delete a specific check by ID',
            tags: ['Checks'],
            responses: {
              200: responses.success({
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'success' },
                  message: { type: 'string', example: 'Check deleted successfully' }
                }
              }),
              401: responses.error('Unauthorized'),
              404: responses.error('Check not found')
            }
          }
        },
      
      // Stats Routes
      '/stats/dashboard': {
        get: {
          summary: 'Get dashboard statistics',
          tags: ['Stats'],
          responses: {
            200: responses.success({ $ref: '#/components/schemas/StatsResponse' }),
            401: responses.error('Unauthorized')
          }
        }
      },
      '/stats/streaks': {
        get: {
          summary: 'Get streak information for all goals',
          tags: ['Stats'],
          responses: {
            200: responses.success({ $ref: '#/components/schemas/StreakResponse' }),
            401: responses.error('Unauthorized')
          }
        }
      },
      '/stats/scores': {
        get: {
          summary: 'Get daily score history',
          tags: ['Stats'],
          parameters: [
            {
              name: 'startDate',
              in: 'query',
              required: true,
              schema: { type: 'string', format: 'date' },
              description: 'Start date in YYYY-MM-DD format'
            },
            {
              name: 'endDate',
              in: 'query',
              required: true,
              schema: { type: 'string', format: 'date' },
              description: 'End date in YYYY-MM-DD format'
            },
            {
              name: 'type',
              in: 'query',
              required: false,
              schema: { type: 'string', enum: ['daily', 'streak'] },
              description: 'Optional stat type filter'
            }
          ],
          responses: {
            200: responses.success({ $ref: '#/components/schemas/ScoresResponse' }),
            400: responses.error('Invalid date parameters'),
            401: responses.error('Unauthorized')
          }
        }
      },
      
      // Health Routes
      '/health': {
        get: {
          summary: 'Check API health status',
          tags: ['System'],
          security: [],
          responses: {
            200: responses.success({ $ref: '#/components/schemas/HealthResponse' })
          }
        }
      }
    }
  },
  apis: []
};

const specs = swaggerJsdoc(options);

module.exports = { 
  serve: swaggerUi.serve, 
  setup: swaggerUi.setup(specs, { 
    defaultModelsExpandDepth: -1  // Collapses the schemas section
  })
};