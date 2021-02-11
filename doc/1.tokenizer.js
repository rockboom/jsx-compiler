let esprima = require("esprima");
let estraverse = require("estraverse-fb");
let sourcecode = `<div id="title"><span>hello</span>world</div>`;
let ast = esprima.parseModule(sourcecode,{jsx:true,tokens:true})
// console.log(ast);
let indent = 0;
function padding(){
    return " ".repeat(indent);
}

// visitor 访问器 访问者
estraverse.traverse(ast,{
    enter(node){
        console.log(padding()+node.type+"进入");
        indent+=2;
    },
    leave(node){
        indent-=2;
        console.log(padding()+node.type+"离开");
    }
});

/*
* esprima内部得到抽象语法树 需要两步
* 1.把源码进行分词，得到一个token的数组
* 2.把token数组转成一个抽象语法树
* <div id="title"><span>hello</span>world</div>
* tokens: [
    { type: 'Punctuator', value: '<' },
    { type: 'JSXIdentifier', value: 'div' },
    { type: 'JSXIdentifier', value: 'id' },
    { type: 'Punctuator', value: '=' },
    { type: 'String', value: '"title"' },
    { type: 'Punctuator', value: '>' },
    { type: 'Punctuator', value: '<' },
    { type: 'JSXIdentifier', value: 'span' },
    { type: 'Punctuator', value: '>' },
    { type: 'JSXText', value: 'hello' },
    { type: 'Punctuator', value: '<' },
    { type: 'Punctuator', value: '/' },
    { type: 'JSXIdentifier', value: 'span' },
    { type: 'Punctuator', value: '>' },
    { type: 'JSXText', value: 'world' },
    { type: 'Punctuator', value: '<' },
    { type: 'Punctuator', value: '/' },
    { type: 'JSXIdentifier', value: 'div' },
    { type: 'Punctuator', value: '>' }
  ]
* */
