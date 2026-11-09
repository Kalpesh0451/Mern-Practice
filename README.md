# EduSphere – Student Management System

A MERN-stack academic administration application built with MongoDB, Express.js, React.js and Node.js.

## Main modules
- Dashboard and reports
- Student management
- Course management
- Instructor management
- Enrollment management
- Authentication and role-based access
- Admin user management
- Student profile image upload
- Enrollment email notifications

> Confirm each feature against the final code before submission. Dashboard summary figures and any sample/placeholder values should be clearly identified if they are not database-driven.

## Technology stack
**Frontend:** React, Vite, JavaScript, React Router, Axios, Bootstrap/CSS, Chart.js (where used).  
**Backend:** Node.js, Express.js, Mongoose, MongoDB, JWT, bcrypt, Multer, Nodemailer.  
**Testing/tools:** Jest, Supertest, Postman, Git, GitHub, MongoDB Atlas.

## Requirements
- Node.js and npm
- MongoDB Atlas account or a reachable MongoDB instance
- Git

## Setup

### 1. Clone
```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd mern-practice
```

### 2. Backend
```bash
cd server
npm install
```

Create `server/.env` locally. Do not commit this file.

```env
PORT=5001
MONGO_URI=<YOUR_MONGODB_CONNECTION_STRING>
JWT_SECRET=<LONG_RANDOM_SECRET>
CLIENT_URL=http://localhost:5173
EMAIL_USER=<YOUR_GMAIL_ADDRESS>
EMAIL_PASS=<YOUR_GMAIL_APP_PASSWORD>
ADMIN_NAME=<INITIAL_ADMIN_NAME>
ADMIN_EMAIL=<INITIAL_ADMIN_EMAIL>
ADMIN_PASSWORD=<INITIAL_ADMIN_PASSWORD>
```

Start the backend using the script defined in `server/package.json`, typically:
```bash
npm run dev
```

Backend base URL: `http://localhost:5001`

### 3. Frontend
Open a second terminal:
```bash
cd client
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

### 4. Tests
```bash
cd server
npm test
```
Record the actual date and output from the final test run in the submission. A previously reported run passed 38 tests; rerun before claiming this as the final result.

## MongoDB Atlas configuration
1. Create an Atlas project and cluster.
2. Create a database user with a strong password and only the permissions needed by the application.
3. Add the developer machine's current public IP to Network Access. Avoid `0.0.0.0/0` for a final submission unless there is a justified temporary requirement.
4. Copy the MongoDB connection string and place it in `MONGO_URI` in `server/.env`.
5. Replace the database name placeholder in the URI if necessary.
6. Start the backend and verify the connection message.

Never include a real connection string, username, password or secret in GitHub or this README.

## Email configuration (Gmail / Nodemailer)
1. Use a dedicated Gmail account if possible.
2. Enable Google 2-Step Verification.
3. Generate an App Password if the account is eligible and organizational policy allows it.
4. Put the Gmail address in `EMAIL_USER` and the App Password in `EMAIL_PASS`.
5. Never use your normal Gmail password in source code.
6. Test an enrollment email using a test recipient and check spam/junk if it is not received.

## API overview
The backend route groups include:
- `/api/auth`
- `/api/students`
- `/api/courses`
- `/api/instructors`
- `/api/enrollments`
- `/api/reports`
- `/api/users`

See `API_DOCUMENTATION.md` and the Postman collection in `postman/`. Verify exact HTTP methods, route suffixes, request fields and response examples against the actual Express route files before submission.

## Architecture
React/Vite provides the UI and sends HTTP requests to the Express API. Express routes apply middleware (including authentication/authorization where configured), invoke controllers and interact with MongoDB through Mongoose models. Multer handles configured uploads; Nodemailer sends configured email notifications.

## Roles
The project has Admin, Staff and Viewer roles. The intended permissions documented during development are:
- View: Admin, Staff, Viewer
- Add: Admin, Staff
- Edit: Admin, Staff
- Delete: Admin only
- Manage users: Admin only

Verify the final backend route middleware and UI restrictions match this matrix.

## Repository hygiene
Do not commit:
- `.env` or any file containing credentials
- `node_modules/`
- build output, logs, coverage output
- uploaded personal/student images unless they are approved demo assets

Check before pushing:
```bash
git status
git ls-files server/.env
git diff --cached --name-only
```

If a secret was ever committed, removing it from the latest commit is not sufficient: rotate the exposed credential.

## Submission materials
- GitHub repository: <YOUR_GITHUB_REPOSITORY_URL>
- Demo video: <ADD_GOOGLE_DRIVE_VIEWER_LINK>
- Screenshots: see `screenshots/`
- Schema: `DATABASE_SCHEMA.md`
- Features: `FEATURES.md`
- API: `API_DOCUMENTATION.md` and `postman/`
- Limitations: `KNOWN_ISSUES.md`
- Security: `SECURITY_REVIEW.md`
