const numbers = [10, 20, 30, 40, 50];

const doubled = numbers.map(number => number * 2);
const above25 = numbers.filter(number => number > 25);
const firstAbove25 = numbers.find(number => number > 25);
const hasEven = numbers.some(number => number % 2 === 0);
const total = numbers.reduce((sum, number) => sum + number, 0);

console.log("map:", doubled);
console.log("filter:", above25);
console.log("find:", firstAbove25);
console.log("some:", hasEven);
console.log("reduce (sum):", total);
