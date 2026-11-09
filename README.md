# EduSphere – Student Management System

A full-stack Student Management System developed using the MERN stack (MongoDB, Express.js, React.js, and Node.js). EduSphere provides a centralized platform to manage students, courses, instructors, enrollments, users, and academic reports.

## 1. Project Overview

EduSphere is designed to simplify academic administration through a centralized dashboard and management interface. It provides CRUD operations, authentication, role-based access control, reporting, profile image uploads, and enrollment email notifications.

**Project:** EduSphere – Student Management System  
**Technology:** MERN Stack  
**Developer:** Kalpesh Dipak Patil  
**Purpose:** MERN Stack Training Project – GetSphere Technologies

## 2. Features

### 2.1 Dashboard
- Overview of system statistics.
- Student, course, instructor, and enrollment summaries.
- Active and inactive course statistics.
- Enrollment trends and course-wise distribution.
- Recent enrollment information.

### 2.2 Student Management
- Add, view, update, and delete student records.
- Automatically generate student IDs.
- Validate student information.
- Upload and display student profile images.
- Search and manage student records.

### 2.3 Course Management
- Add, view, update, and delete courses.
- Manage course information, fees, and status.
- Validate course information.

### 2.4 Instructor Management
- Add, view, update, and delete instructor records.
- Manage instructor details, specialization, qualification, and experience.
- Validate instructor information.

### 2.5 Enrollment Management
- Enroll students in courses.
- View and update enrollment details.
- Manage enrollment dates and statuses.
- Prevent duplicate student-course enrollments.
- Send enrollment confirmation emails.

### 2.6 Reports and Analytics
- Dashboard statistics.
- Course and instructor status reports.
- Student enrollment trends.
- Visual charts using Chart.js.

### 2.7 Authentication and Authorization
- JWT-based user authentication.
- Password hashing using bcrypt.
- Protected application routes.
- Role-based access control.

| Permission | Admin | Staff | Viewer |
|---|---|---|---|
| View records | Yes | Yes | Yes |
| Add records | Yes | Yes | No |
| Edit records | Yes | Yes | No |
| Delete records | Yes | No | No |
| Manage users | Yes | No | No |

### 2.8 User Management
- Manage application user accounts.
- Manage user roles.
- Activate and deactivate accounts.

## 3. Technologies Used

**Frontend**
- React.js
- Vite
- JavaScript
- HTML5 and CSS3
- Axios
- React Router
- Chart.js

**Backend**
- Node.js
- Express.js
- REST APIs
- Mongoose

**Database**
- MongoDB
- MongoDB Atlas

**Authentication and Additional Libraries**
- JSON Web Token (JWT)
- bcrypt
- Multer
- Nodemailer
- Helmet
- CORS

**Testing**
- Jest
- Supertest
- Postman

**Development Tools**
- Visual Studio Code
- Git and GitHub

## 4. Application Architecture

EduSphere follows a client-server architecture.

1. The user interacts with the React frontend.
2. Axios sends HTTP requests to the Express backend.
3. Routes direct requests to the appropriate controllers.
4. Middleware handles authentication, authorization, and request processing.
5. Controllers execute application logic.
6. Mongoose communicates with MongoDB.
7. The backend returns JSON responses to the frontend.

## 5. Project Structure

```text
mern-practice/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── layouts/
│       ├── pages/
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
│   ├── scripts/
│   ├── services/
│   ├── tests/
│   ├── uploads/
│   ├── app.js
│   └── server.js
│
├── .gitignore
└── README.md
```

*This is a representative structure. Refer to the repository for the complete file structure.*

## 6. Installation and Setup

### Prerequisites
- Node.js and npm
- MongoDB Atlas account or a MongoDB instance
- Git
- Visual Studio Code

### Step 1: Clone the Repository

```bash
git clone https://github.com/Kalpesh0451/Mern-Practice.git
cd Mern-Practice
```

### Step 2: Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory and configure the following variables:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173

EMAIL_USER=your_email_address
EMAIL_PASS=your_gmail_app_password

ADMIN_NAME=Administrator
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password
```

Replace the placeholder values with your own configuration. Never commit the actual `.env` file or share credentials publicly.

Start the backend:

```bash
npm run dev
```

Backend URL: `http://localhost:5001`

### Step 3: Frontend Setup

Open another terminal from the project root:

```bash
cd client
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## 7. MongoDB Configuration

1. Create a MongoDB Atlas account.
2. Create a database cluster.
3. Create a database user with appropriate permissions.
4. Configure Network Access for your development environment.
5. Copy the MongoDB connection string.
6. Add the connection string to `MONGO_URI` in the backend `.env` file.

Do not expose your MongoDB credentials or connection string in the repository.

## 8. Email Configuration

EduSphere uses Nodemailer with Gmail SMTP for enrollment confirmation emails.

1. Use a Gmail account for SMTP configuration.
2. Enable two-step verification.
3. Generate a Google App Password.
4. Configure `EMAIL_USER` and `EMAIL_PASS` in the backend `.env` file.
5. Verify email functionality by creating a test enrollment.

Never publish your email password or App Password.

## 9. API Modules

The backend provides REST API modules for:

| Module | Base endpoint |
|---|---|
| Authentication | `/api/auth` |
| Students | `/api/students` |
| Courses | `/api/courses` |
| Instructors | `/api/instructors` |
| Enrollments | `/api/enrollments` |
| Reports | `/api/reports` |
| User Management | `/api/users` |

For detailed endpoint methods, request bodies, authentication headers, and sample responses, refer to the API documentation included with the project submission.

## 10. Database Collections

EduSphere uses MongoDB collections managed through Mongoose models.

| Collection | Purpose |
|---|---|
| Students | Student details and profile information |
| Courses | Course information and status |
| Instructors | Instructor information |
| Enrollments | Student-course enrollment records |
| Users | Application user accounts and roles |
| Counters | Sequential student ID generation |

The Enrollment collection references Student and Course documents. A unique compound index prevents duplicate enrollment pairs.

## 11. Security Measures

The application includes the following reported security measures:

- JWT-based authentication.
- Password hashing using bcrypt.
- Role-based authorization.
- Helmet security headers.
- CORS origin restrictions.
- Environment variables for sensitive configuration.
- Request body size limits.
- Mongoose schema validation.
- File upload restrictions.

Rate-limiting configuration and additional production security checks should be verified before describing them as fully implemented.

## 12. Automated Testing

The backend uses Jest and Supertest for automated API testing.

Run tests from the server directory:

```bash
npm test
```

The latest previously reported test result was:

- Test suites passed: 1
- Tests passed: 38
- Tests failed: 0

Run the test command again before submission and update this section if the result changes.

## 13. Project Documentation and Supporting Materials

The project submission includes supporting material covering:

- Project documentation.
- Database schema documentation.
- API documentation and sample requests.
- Security review.
- Screenshots of major application pages.
- Automated test results.
- Known issues and incomplete features.
- Application demonstration video.

Add the actual document paths or links below once these materials are uploaded:

- **Project Documentation:** `docs/Project_Documentation.pdf`
- **Database Schema:** `docs/Database_Schema.pdf`
- **API Documentation:** `docs/API_Documentation.pdf`
- **Security Review:** `docs/Security_Review.pdf`
- **Screenshots:** `screenshots/`
- **Test Results:** `test-results/`
- **Demo Video:** Add your Google Drive demonstration link here.

## 14. Known Issues and Limitations

Refer to `KNOWN_ISSUES.md` in the repository for the current list of verified bugs, incomplete features, and items requiring further testing.

Do not treat unverified functionality as confirmed complete.

## 15. Future Enhancements

- Attendance management.
- Student fee management.
- PDF and Excel report exports.
- Password reset functionality.
- Advanced analytics.
- Cloud-based image storage.
- Production deployment.
- Additional frontend and integration testing.

## 16. Conclusion

EduSphere demonstrates full-stack application development using the MERN stack. It brings together student, course, instructor, and enrollment management with authentication, role-based authorization, reporting, file uploads, email notifications, and automated backend testing.

The project provides a centralized academic management platform and demonstrates practical knowledge of frontend development, backend API development, database operations, security, and testing.

---

**EduSphere – Student Management System**  
Developed by **Kalpesh Dipak Patil**  
Prepared for **GetSphere Technologies**
