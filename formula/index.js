let parse = require('./parse.js');
let evaluate = require('./evaluate.js');
let sourceCode = '2+3*4+4';
let ast = parse(sourceCode);
console.log(JSON.stringify(ast, null, 2));
let result = evaluate(ast);
console.log(result);