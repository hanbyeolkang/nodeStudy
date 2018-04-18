let calculator = {};
calculator.add = function(a, b) {
  return a+b;
}
calculator.subtract = function(a, b) {
  return a-b;
}
let calculator1 = require('./calculator1');
let calculator2 = require('./calculator2');

console.log('10 + 10 = ' + calculator.add(10, 10));
console.log('10 + 10 = ' + calculator1.add(10, 10));
console.log('10 + 10 = ' + calculator2.add(10, 10));
