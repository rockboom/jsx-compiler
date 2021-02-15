const {
    parser
} = require('./parser');
const {
    transformer
} = require('./transformer');
const {
    codeGenerator
} = require('./codeGenerator');

let code = `<div id="title" name={myname}><span>hello</span>world</div>`;
let ast = parser(code); // 把源代码转成语法树
transformer(ast); // 把语法树转成新的语法树
let result = codeGenerator(ast);
console.log(result);