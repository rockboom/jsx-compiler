let parse = require('./parse.js');
let evaluate = require('./evaluate.js');
let sourceCode = '(3-2)*3*(2+2)';
debugger

let ast = parse(sourceCode);
console.log(JSON.stringify(ast, null, 2));
let result = evaluate(ast);
console.log(result);