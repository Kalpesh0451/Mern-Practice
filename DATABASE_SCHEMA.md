# EduSphere Database Schema

This document describes the Mongoose collections identified during project development. Confirm the exact final model definitions before submission; fields not established from the reviewed model files are marked for verification rather than invented.

## Collections

### 1. Student
| Field | Type | Constraints / notes |
|---|---|---|
| `studentId` | Number | Sequential ID generated using Counter; unique |
| `fullName` | String | Required; trimmed; length limits configured |
| `email` | String | Required; unique; lowercase; trimmed; email format validation |
| `mobileNumber` | String | Required; validated phone-number characters and digit count |
| `gender` | String | Required; enum configured |
| `address` | String | Required; trimmed; length validation |
| `profileImage` | String | Optional image path/URL; defaults to empty string |
| `createdAt` | Date | Mongoose timestamp |
| `updatedAt` | Date | Mongoose timestamp |

**Relationships:** Student is referenced by Enrollment.  
**Indexes:** Unique `studentId`; unique `email`. Confirm actual index definitions in `student.js`.

### 2. Counter
| Field | Type | Constraints / notes |
|---|---|---|
| `seq` | Number | Used to generate sequential student IDs |

The Counter collection supports sequential student ID generation. Confirm the counter document's key/name and initial value in the final model.

### 3. Enrollment
| Field | Type | Constraints / notes |
|---|---|---|
| `student` | ObjectId | Required; reference to Student |
| `course` | ObjectId | Required; reference to Course |
| `enrollmentDate` | Date | Defaults to current date |
| `status` | String | Enum: Active, Completed, Cancelled; defaults to Active |
| `createdAt` | Date | Mongoose timestamp |
| `updatedAt` | Date | Mongoose timestamp |

**Relationships:** Many enrollment records can refer to a student and a course.  
**Indexes:** Unique compound index on `{ student: 1, course: 1 }` to prevent duplicate student-course pairs.

### 4. Course
Course model exists in the project. Populate this section from `server/models/Course.js` before submission:
- Field names and types: **verify from model**
- Required/optional fields: **verify**
- Enum values/defaults: **verify**
- Indexes and relationships: **verify**

### 5. Instructor
Instructor model exists in the project. Populate this section from `server/models/Instructor.js` before submission:
- Field names and types: **verify from model**
- Required/optional fields: **verify**
- Enum values/defaults: **verify**
- Indexes and relationships: **verify**

### 6. User
User model exists in the project and supports authentication/roles. Populate this section from `server/models/User.js` before submission:
- Field names and types: **verify from model**
- Password hashing behavior: **verify from model/controller**
- Role enum values: Admin, Staff, Viewer (verify exact capitalization)
- Account status fields/defaults: **verify**
- Indexes: **verify**

## Relationship summary
```text
Student 1 ─── many Enrollment many ─── 1 Course

User: application accounts and role-based access
Instructor: instructor records; course relationship must be verified from model
Counter: supports sequential Student.studentId generation
```

## Validation and integrity notes
- Student email and student ID are configured as unique.
- Enrollment has a unique compound student/course index.
- Mongoose update validators must be enabled in update operations where validation is required (`runValidators: true`).
- MongoDB unique-index violations should be handled as duplicate-key errors (commonly error code `11000`).

## Final verification
Before submission, compare every table above with the final files in `server/models/`. Do not submit the “verify” placeholders as if they were completed schema details.
