# User Management System

This project is a simple user management API with a frontend application. It allows you to manage users by creating, reading, updating, deleting, searching, and logging in.

- The backend is built with Node.js and Express.

- The frontend is built with React.

- Data is stored in a local SQLite database.

The goal of this setup is to improve an old Python API by making the code cleaner, safer, and easier to maintain.

## 🎯 Project Structure

```
retainsure_assignment/
├── backend/
│   ├── server.js              # Express server setup
│   ├── healthcare.db          # SQLite database
│   └── package.json           # Backend dependencies
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/     # Main dashboard component
│   │   │   ├── UserList/      # List all users, with search feature
│   │   │   ├── UserDetail/    # View user details, edit and delete buttons
│   │   │   └── UserForm/      # Form to create or edit a user
│   │   │   ├── Login/         # Login form component
│   │   ├── App.js             # Main application component
│   │   ├── App.css            # Global styles
│   │   └── index.js           # React entry point
│   └── package.json           # Frontend dependencies
└── README.md
```

### Prerequisites
- Node.js (v14 or higher)
- npm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <https://github.com/seshu362/RetainSure-UserManagement-Task-1>
   cd retainsure_assignment
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   node server.js
   ```
   Server will run on http://localhost:5000

3. **Setup Frontend** (in new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Application will open on http://localhost:3001

##  Backend (backend/)
- Contains the Node.js Express server in a single file server.js.
- Connects to a SQLite database file users.db which stores all users.
- Implements all required API endpoints for user management:
    - Health check (GET /)
    - List all users (GET /users)
    - Get a specific user by ID (GET /user/:id)
    - Create a new user (POST /users)
    - Update an existing user (PUT /user/:id)
    - Delete a user (DELETE /user/:id)
    - Search users by name (GET /search?name=)
    - User login (POST /login)
- Uses parameterized queries to avoid SQL injection.
- Returns meaningful JSON responses with appropriate HTTP status codes.

##  Frontend (frontend/)
- Built with React for a simple user interface.
- Provides screens to:
    - List all users with search functionality.
    - View individual user details.
    - Create and edit users.
    - Delete users.
    - Login as a user.
- Uses normal CSS for styling to keep UI clean and straightforward.
- All components live inside src/components folder, each with its own folder and CSS.

## Major issues identified in the original Python code:
- It put user input directly into database queries, which is dangerous and can cause security problems.
- It didn’t check if the data users sent was complete or valid.
- Passwords were stored as plain text, which is not safe.
- The error messages were just simple text, no proper status codes or clear info for users.
- The database connection was shared in a way that could cause problems when multiple users access it at the same time.
- Lack of Input Validation No checks for required data fields or data format.
- All logic was inline within route handlers, and some responses were plain text, limiting maintainability.

## What I changed and why:
- Rewrote the backend in Node.js with Express because it’s easier for me to work with asynchronous code and modern practices.
- Used safe, parameterized SQL queries so inputs can’t cause security issues.
- Added checks to make sure all the needed information is there before saving or updating.
- Used proper HTTP status codes (like 400 for bad requests, 404 if a user isn’t found) and all responses return JSON objects with clear messages or errors instead of plain strings..
- Made sure the database is set up properly before starting the server.
- Database Initialization on Startup Ensures the `users` table exists before processing requests.
- Proper HTTP Status Codes Used `200`, `201`, `400`, `401`, `404`, `409`, `500` to align with REST API best practices
- Kept all the code in one file, keeping it simple and easy to understand like you wanted.
- Unique Email Constraint Handling Returns `409 Conflict` when trying to create a user with an already existing email.
- Used a better database connection style that avoids problems from sharing a cursor globally.

## What I assumed or  trade-offs:
- Passwords are still saved as plain text to match the original code and the challenge scope, but for a real project, passwords should always be hashed.
- Didn’t add any new features or routes — kept everything the same as before.

## What I would do with more time:
- Make passwords secure by hashing them and add proper login/authentication (like JWT tokens).
- Add user permissions so that only the logged-in user can edit or delete their own data. While users could still view others’ data, actions like editing or deleting should be restricted. This would be part of implementing role-based access control, ensuring users can only perform actions they are authorized for.
- Set up logging and error alerting to quickly catch and fix problems.
- Organize the backend code into smaller modules for easier maintenance.

