# Goal Tracker API

A RESTful API for tracking personal goals and habits, built with Express.js and MongoDB.

## Current Status

This project is currently in the documentation-first planning phase. The API endpoints have been defined with comprehensive Swagger documentation, and the basic project structure is in place.

## Features

- User authentication using Firebase
- CRUD operations for personal goals
- Daily goal tracking
- Progress statistics and streaks
- RESTful API design with proper status codes and error handling
- API documentation with Swagger

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose
- Firebase Authentication
- Swagger for API documentation

## Project Structure

```
/goal-tracker-api
  /controllers - Business logic for handling requests
  /routes - API endpoint definitions and documentation
  /docs - Swagger configuration
```

## API Endpoints

### Users
- POST /api/auth/register - Register user with Firebase credentials
- GET /api/auth/user - Get current user information

### Goals
- GET /api/goals - Get all goals for current user
- POST /api/goals - Create a new goal
- GET /api/goals/:id - Get a specific goal
- PUT /api/goals/:id - Update a goal
- DELETE /api/goals/:id - Delete a goal
- PATCH /api/goals/reorder - Update goal display order

### Checks
- GET /api/checks/week - Get all checks for current week
- POST /api/checks/:goalId/:date - Toggle goal completion for a specific date
- GET /api/checks/date/:date - Get all checks for a specific date

### Stats
- GET /api/stats/dashboard - Get all dashboard stats
- GET /api/stats/streaks - Get current and best streak information
- GET /api/stats/scores - Get daily and weekly scores

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Firebase project for authentication

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the example provided
4. Start the development server:
   ```bash
   npm start
   ```

## Documentation

API documentation is available at `/api-docs` when the server is running.

## Next Steps

- Implement controller functionality
- Connect to MongoDB database
- Set up Firebase authentication
- Write unit and integration tests