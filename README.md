# Goal Tracker API

A RESTful API for tracking personal goals and habits, built with Express.js and MongoDB.

## 🚀 Project Overview

Goal Tracker API is a comprehensive backend service that allows users to:
- Create and manage personal goals
- Track daily goal completions
- View goal statistics and streaks
- Analyze personal progress

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Firebase Authentication
- **API Documentation**: Swagger UI
- **Testing**: Jest

## ✨ Features

- User registration and authentication
- CRUD operations for goals
- Daily goal tracking and completion
- Streak and progress tracking
- Comprehensive statistics dashboard
- Secure and scalable design

## 🔧 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Firebase project for authentication

## 📦 Installation

1. Clone the repository
   ```bash
   git clone https://github.com/herbertmoroni/goal-tracker-api.git
   cd goal-tracker-api
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   FIREBASE_PRIVATE_KEY=your_firebase_private_key
   ```

4. Start the development server
   ```bash
   npm start
   ```

## 📘 API Documentation

API documentation is available via Swagger UI at `http://localhost:3000/api-docs` when the server is running.

## 🧪 Running Tests

```bash
npm test
```

## 🔒 Authentication

The API uses Firebase Authentication. Obtain an authentication token from Firebase and include it in the request headers.

## 📊 Key Endpoints

- `/api/auth/register`: User registration
- `/api/goals`: Goal management
- `/api/checks`: Goal completion tracking
- `/api/stats`: Progress and statistics