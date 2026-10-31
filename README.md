# Fastor7 CRM Backend Assignment

This project is a CRM backend developed as part of the Fastor7 Full Stack Developer assignment.

The application allows employees (counselors) to register and log in, students to submit enquiries through a public form, and counselors to claim and manage their assigned enquiries.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Features

- Employee registration and login
- Secure password hashing
- Public enquiry submission without authentication
- Fetch all unclaimed enquiries
- Claim an enquiry for a logged-in employee
- Fetch enquiries assigned to the logged-in employee
- JWT-based authentication for protected routes

## Project Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd fastor7-nodejs-crm-assignment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory and add the following:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
```

Replace the MongoDB connection string and JWT secret with your actual values.

### 4. Start the server

For development:

```bash
npm run dev
```

For normal execution:

```bash
npm start
```

The server will run at:

`http://localhost:5000`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new employee |
| POST | `/api/auth/login` | Employee login |
| POST | `/api/enquiries` | Submit a public enquiry |
| GET | `/api/enquiries/public` | Get all unclaimed enquiries |
| PATCH | `/api/enquiries/:id/claim` | Claim an enquiry |
| GET | `/api/enquiries/my-leads` | Get enquiries assigned to the logged-in employee |

## Authentication

The registration and login APIs return a JWT token after successful authentication.

For protected APIs, pass the token in the request headers:

```text
Authorization: Bearer <your_jwt_token>
```

The public enquiry submission API does not require authentication.

## How the Lead Claiming Process Works

When a student submits an enquiry, it is initially available to all counselors.

The `claimedBy` field is set to `null`, which means the enquiry is still unclaimed.

When a counselor claims an enquiry, their employee ID is saved in the `claimedBy` field.

After that:

- The enquiry is removed from the public enquiries list.
- It becomes available only in the assigned counselor's leads list.
- Other counselors cannot claim the same enquiry.

The claim operation uses an atomic database update to prevent multiple counselors from successfully claiming the same enquiry.

## Project Structure

```text
src/
├── config/
│   └── db.js
├── controllers/
│   ├── auth.controller.js
│   └── enquiry.controller.js
├── middleware/
│   ├── auth.middleware.js
│   └── error.middleware.js
├── models/
│   ├── Employee.js
│   └── Enquiry.js
├── routes/
│   ├── auth.routes.js
│   └── enquiry.routes.js
├── app.js
└── server.js

.env
.gitignore
package.json
README.md
```

## Testing

All APIs can be tested using Postman.

Recommended testing flow:

1. Register two different employees.
2. Log in with both employee accounts.
3. Submit a new enquiry using the public enquiry API.
4. Fetch public enquiries using the first employee's token.
5. Claim the enquiry using the first employee's token.
6. Check that the claimed enquiry no longer appears in the public list.
7. Fetch my leads using the first employee's token.
8. Verify that the second employee cannot see the first employee's claimed enquiry in their own leads.

## Security

- Passwords are hashed before storing them in the database.
- JWT authentication protects private APIs.
- The logged-in employee is identified using the verified JWT token.
- Environment variables are used to store sensitive configuration.
- The same enquiry cannot be successfully claimed by multiple counselors.