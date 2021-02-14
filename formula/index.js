let parse = require('./parse.js');
let sourceCode = '2+3*4';
let ast = parse(sourceCode);
console.log(JSON.stringify(ast, null, 2));