const students = [
  { id: 1, name: "Aarav", marks: 82 },
  { id: 2, name: "Diya", marks: 91 },
  { id: 3, name: "Kabir", marks: 67 },
  { id: 4, name: "Meera", marks: 76 },
  { id: 5, name: "Rohan", marks: 88 }
];

// 1. Filter students who scored 75 or more
const passedStudents = students.filter(student => student.marks >= 75);
console.log("Students with 75+ marks:", passedStudents);

// 2. Search for a student by ID
const searchedStudent = students.find(student => student.id === 3);
console.log("Student with ID 3:", searchedStudent);

// 3. Calculate average marks
const totalMarks = students.reduce((sum, student) => sum + student.marks, 0);
const averageMarks = totalMarks / students.length;
console.log("Average marks:", averageMarks);

// 4. Sort students alphabetically (without mutating original array)
const alphabeticalStudents = [...students].sort((a, b) =>
  a.name.localeCompare(b.name)
);
console.log("Alphabetical order:", alphabeticalStudents);

// 5. Transform the array into a list of student names and results
const studentResults = students.map(student => ({
  studentName: student.name,
  result: student.marks >= 40 ? "Pass" : "Fail"
}));
console.log("Transformed student list:", studentResults);

// 6. Check whether any student scored 90 or more
const hasTopScorer = students.some(student => student.marks >= 90);
console.log("Has a 90+ scorer?", hasTopScorer);
