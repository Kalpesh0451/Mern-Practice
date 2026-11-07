# EduSphere – Student Management System

A full-stack Student Management System developed using the MERN stack (MongoDB, Express.js, React.js, and Node.js). EduSphere provides an organized platform to manage students, courses, instructors, enrollments, and reports.

## Project Overview

EduSphere is designed to simplify academic administration by providing a centralized dashboard for managing student and course-related information.

## Features

### 1. Dashboard
- Overview of system statistics.
- Summary of students, courses, and instructors.
- Quick navigation to management modules.

### 2. Student Management
- Add new students.
- View student details.
- Update student information.
- Delete student records.
- Search and manage student records.

### 3. Course Management
- Add and manage courses.
- View course details.
- Update course information.
- Delete courses.
- Manage course status and fees.

### 4. Instructor Management
- Add instructors.
- View instructor profiles.
- Update instructor information.
- Delete instructor records.
- Manage instructor specialization and experience.

### 5. Enrollment Management
- Enroll students in courses.
- View enrollment details.
- Update enrollment information.
- Manage enrollment status.
- Prevent duplicate student-course enrollments.

### 6. Reports & Analytics
- Dashboard statistics.
- Course and instructor status reports.
- Student enrollment trends.
- Visual charts using Chart.js.

## Technologies Used

**Frontend**
- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Axios
- React Router
- Chart.js

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- REST APIs

**Development Tools**
- Visual Studio Code
- Postman
- Git and GitHub
- MongoDB Atlas

## Project Structure

```text
mern-practice/
│
├── client/
│   ├── public/
│   │   └── logo.png
│   └── src/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       │   └── dashboard/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
│
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js and npm
- MongoDB Atlas account or MongoDB instance
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd mern-practice
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the server directory:

```env
PORT=5001
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
```

Start the backend:

```bash
npm run dev
```

Backend URL: `http://localhost:5001`

### 3. Frontend Setup

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## API Modules

| Module | Endpoint |
|---|---|
| Students | `/api/students` |
| Courses | `/api/courses` |
| Instructors | `/api/instructors` |
| Enrollments | `/api/enrollments` |
| Reports | `/api/reports` |

## Application Purpose

This project was developed as part of practical MERN Stack training to demonstrate full-stack development skills, REST API integration, database operations, frontend development, and CRUD functionality.

## Project Name

**EduSphere – Student Management System**