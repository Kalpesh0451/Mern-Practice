const marks = 78;

if (marks >= 90) {
  console.log("Grade A");
} else if (marks >= 75) {
  console.log("Grade B");
} else if (marks >= 60) {
  console.log("Grade C");
} else {
  console.log("Needs improvement");
}

const subjects = ["JavaScript", "React", "Node.js"];

for (let i = 0; i < subjects.length; i++) {
  console.log("For loop:", subjects[i]);
}

for (const subject of subjects) {
  console.log("For...of:", subject);
}

let count = 1;
while (count <= 3) {
  console.log("Count:", count);
  count++;
}
