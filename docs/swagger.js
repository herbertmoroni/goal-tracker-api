const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Goal Tracker API',
      version: '1.0.0',
      description: 'A RESTful API for tracking personal goals and habits',
      contact: {
        name: 'API Support',
        email: 'support@goaltracker.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
      {
        url: 'https://api.goaltracker.com/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            code: {
              type: 'integer',
              example: 400,
            },
            message: {
              type: 'string',
              example: 'Invalid input data',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  param: {
                    type: 'string',
                    example: 'name',
                  },
                  message: {
                    type: 'string',
                    example: 'Name is required',
                  },
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85',
            },
            firebaseUid: {
              type: 'string',
              example: 'uId123456789',
            },
            displayName: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T12:00:00Z',
            },
            lastLogin: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-05T15:30:00Z',
            },
          },
        },
        UserInput: {
          type: 'object',
          required: ['firebaseUid', 'email'],
          properties: {
            firebaseUid: {
              type: 'string',
              example: 'uId123456789',
            },
            displayName: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
          },
        },
        Goal: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60d21b4667d0d8992e610c86',
            },
            userId: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85',
            },
            name: {
              type: 'string',
              example: 'Exercise daily',
            },
            icon: {
              type: 'string',
              example: 'fitness',
            },
            positive: {
              type: 'boolean',
              example: true,
            },
            points: {
              type: 'integer',
              example: 5,
            },
            order: {
              type: 'integer',
              example: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T12:00:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-05T15:30:00Z',
            },
          },
        },
        GoalInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              example: 'Exercise daily',
            },
            icon: {
              type: 'string',
              example: 'fitness',
            },
            positive: {
              type: 'boolean',
              example: true,
            },
            points: {
              type: 'integer',
              example: 5,
              minimum: 1,
              maximum: 10,
            },
            order: {
              type: 'integer',
              example: 1,
            },
          },
        },
        GoalReorderInput: {
          type: 'object',
          required: ['goals'],
          properties: {
            goals: {
              type: 'array',
              items: {
                type: 'object',
                required: ['_id', 'order'],
                properties: {
                  _id: {
                    type: 'string',
                    example: '60d21b4667d0d8992e610c86',
                  },
                  order: {
                    type: 'integer',
                    example: 2,
                  },
                },
              },
            },
          },
        },
        Check: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60d21b4667d0d8992e610c87',
            },
            goalId: {
              type: 'string',
              example: '60d21b4667d0d8992e610c86',
            },
            userId: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85',
            },
            date: {
              type: 'string',
              format: 'date',
              example: '2023-01-05',
            },
            completed: {
              type: 'boolean',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-05T15:30:00Z',
            },
          },
        },
        WeekChecks: {
          type: 'object',
          properties: {
            startDate: {
              type: 'string',
              format: 'date',
              example: '2023-01-01',
            },
            endDate: {
              type: 'string',
              format: 'date',
              example: '2023-01-07',
            },
            checks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  goalId: {
                    type: 'string',
                    example: '60d21b4667d0d8992e610c86',
                  },
                  goalName: {
                    type: 'string',
                    example: 'Exercise daily',
                  },
                  dates: {
                    type: 'object',
                    additionalProperties: {
                      type: 'boolean',
                    },
                    example: {
                      '2023-01-01': true,
                      '2023-01-02': false,
                      '2023-01-03': true,
                      '2023-01-04': true,
                      '2023-01-05': false,
                      '2023-01-06': true,
                      '2023-01-07': false,
                    },
                  },
                },
              },
            },
          },
        },
        DashboardStats: {
          type: 'object',
          properties: {
            activeGoals: {
              type: 'integer',
              example: 5,
            },
            currentStreak: {
              type: 'integer',
              example: 7,
            },
            bestStreak: {
              type: 'integer',
              example: 14,
            },
            weeklyScore: {
              type: 'integer',
              example: 85,
            },
            weekProgress: {
              type: 'object',
              properties: {
                completed: {
                  type: 'integer',
                  example: 12,
                },
                total: {
                  type: 'integer',
                  example: 15,
                },
                percentage: {
                  type: 'number',
                  format: 'float',
                  example: 80,
                },
              },
            },
          },
        },
        Streak: {
          type: 'object',
          properties: {
            current: {
              type: 'integer',
              example: 7,
            },
            best: {
              type: 'integer',
              example: 14,
            },
            startDate: {
              type: 'string',
              format: 'date',
              example: '2023-01-01',
            },
          },
        },
        Scores: {
          type: 'object',
          properties: {
            daily: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  date: {
                    type: 'string',
                    format: 'date',
                    example: '2023-01-01',
                  },
                  score: {
                    type: 'integer',
                    example: 15,
                  },
                  completedGoals: {
                    type: 'integer',
                    example: 3,
                  },
                  totalGoals: {
                    type: 'integer',
                    example: 5,
                  },
                },
              },
            },
            weekly: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  weekStart: {
                    type: 'string',
                    format: 'date',
                    example: '2023-01-01',
                  },
                  weekEnd: {
                    type: 'string',
                    format: 'date',
                    example: '2023-01-07',
                  },
                  score: {
                    type: 'integer',
                    example: 85,
                  },
                  completedGoals: {
                    type: 'integer',
                    example: 17,
                  },
                  totalGoals: {
                    type: 'integer',
                    example: 20,
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['../routes/*.js'], // Path to the API routes files
};

const specs = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs),
  specs,
};