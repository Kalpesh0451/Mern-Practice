// Spread: expands an array or object
const firstBatch = ["Amit", "Neha"];
const secondBatch = ["Ravi", "Sara"];
const allStudents = [...firstBatch, ...secondBatch];

const oldStudent = { name: "Kalpesh", marks: 80 };
const updatedStudent = { ...oldStudent, marks: 90, passed: true };

console.log("Combined array:", allStudents);
console.log("Copied and updated object:", updatedStudent);

// Rest: collects remaining arguments into an array
function calculateTotal(...values) {
  return values.reduce((total, value) => total + value, 0);
}
console.log("Rest parameters:", calculateTotal(10, 20, 30, 40));
