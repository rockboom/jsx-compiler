let parse = require('./parse.js');
let evaluate = require('./evaluate.js');
// let sourceCode = '9    -   1 -1  +2+4*8/2/2+4*(2-1)'; // 21
let sourceCode = '1+-2+-3'; // -1
debugger

let ast = parse(sourceCode);
console.log(JSON.stringify(ast, null, 2));
let result = evaluate(ast);
console.log(result);