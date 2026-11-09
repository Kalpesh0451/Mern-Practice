# EduSphere API Documentation

Base URL (local): `http://localhost:5001`

> The route groups below were identified in the project. Exact route suffixes, HTTP methods, required fields and response formats must be confirmed against the final files in `server/routes/` and `server/controllers/`. Do not assume every example is an exact implemented endpoint.

## Route groups

| Module | Route prefix | Purpose |
|---|---|---|
| Authentication | `/api/auth` | Login/authentication |
| Students | `/api/students` | Student records |
| Courses | `/api/courses` | Course records |
| Instructors | `/api/instructors` | Instructor records |
| Enrollments | `/api/enrollments` | Enrollment records |
| Reports | `/api/reports` | Dashboard/report data |
| Users | `/api/users` | User administration |

## Authentication
Protected requests are expected to use a bearer token where required:

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

Never publish a real JWT token or credentials in documentation or screenshots.

## Example request patterns

The following are illustrative request patterns. Confirm exact method/path/body against the route files before using them as contractual API examples.

### Login
```http
POST /api/auth/login
Content-Type: application/json
```
```json
{
  "email": "admin@example.com",
  "password": "<YOUR_TEST_PASSWORD>"
}
```

### Create a student
```http
POST /api/students
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```
```json
{
  "fullName": "Demo Student",
  "email": "demo.student@example.com",
  "mobileNumber": "9876543210",
  "gender": "Male",
  "address": "Pune, Maharashtra"
}
```
The backend generates the sequential `studentId` according to the reviewed Student model. Confirm whether the controller accepts exactly these fields.

### List students
```http
GET /api/students
Authorization: Bearer <JWT_TOKEN>
```

### List courses
```http
GET /api/courses
Authorization: Bearer <JWT_TOKEN>
```

### List instructors
```http
GET /api/instructors
Authorization: Bearer <JWT_TOKEN>
```

### List enrollments
```http
GET /api/enrollments
Authorization: Bearer <JWT_TOKEN>
```

## Postman
Import `postman/EduSphere_Postman_Collection.json`. The collection includes request templates for the known route groups. Replace `baseUrl`, `token`, and sample request bodies as needed. Check every request against the actual Express router before final submission.

## How to verify exact endpoints
Review:
- `server/routes/authRoutes.js` (or actual auth route filename)
- `server/routes/studentRoutes.js` (or actual student route filename)
- `server/routes/courseRoutes.js`
- `server/routes/instructorRoutes.js`
- `server/routes/enrollmentRoutes.js`
- `server/routes/reportRoutes.js`
- `server/routes/userRoutes.js`

Use the actual filenames in your repository. Export a tested Postman collection after verifying methods, paths, auth requirements, query parameters and response examples.
