const {parser} = require('./parser');
const {traverse} = require('./traverse');
// const t = require('babel-types');
const nodeTypes = require('./nodeTypes');

class t{
    // 生成一个新的ast节点
    static nullLiteral(){
        return {type:nodeTypes.NullLiteral}
    }
    static stringLiteral(value){ // value是字符串的值
        return {type:nodeTypes.StringLiteral,value}
    }
    static identifier(name) { // value是字符串的值
        return {type:nodeTypes.Identifier,name}
    }
    static objectExpression(properties){
        return {
            type:nodeTypes.ObjectExpression,
            properties
        }
    }
    static property(key,value){
        return {
            type:nodeTypes.Property,
            key,
            value
        }
    }
    static callExpression(callee,_arguments){
        return {
            type: nodeTypes.CallExpression,
            callee,
            arguments:_arguments
        }
    }
    static memberExpression(object,property){
        return {
            type: nodeTypes.MemberExpression,
            object, 
            property
        }
    }
    // 判断某种节点是不是某种类型
    static isJSXElement(node){
        return node.type === nodeTypes.JSXElement;
    }
    static isJSXText(node){
        return node.type === nodeTypes.JSXText;
    }
}

function transformer(ast){
    debugger
    traverse(ast,{
        JSXElement(nodePath){// 节点的路径 {node} parent
            // 传入一个JSXElement语法树节点，返回一个方法调用的新节点
            function transform(node){
                if(!node){
                    return t.nullLiteral(); // null
                }
                if(t.isJSXElement(node)){ // 要转换的节点是JSXElement 转成一个方法调用
                    let memberExpression = t.memberExpression(
                        t.identifier('React'),
                        t.identifier('createElement'),
                    )
                    let elementType = t.stringLiteral(node.openingElement.name.name); // div span
                    let attributes = node.openingElement.attributes; // JAXAttribute数组

                    let objectExpression;
                    if(attributes.length > 0){
                        objectExpression = t.objectExpression(attributes.map((attr)=>(
                            t.property(t.identifier(attr.name.name), t.stringLiteral(attr.value.value))
                        )));
                    }else{
                        objectExpression = t.nullLiteral();
                    }
                    let _arguments = [elementType,objectExpression,...node.children.map(child=>transform(child))];
                    return t.callExpression(memberExpression,_arguments);
                }else if(t.isJSXText(node)){ // 要转换的节点是JSXText
                    return t.stringLiteral(node.value);
                }
            }
            debugger
            let newNode = transform(nodePath.node);
            nodePath.replaceWith(newNode);
        }
    })
}
module.exports = {
    transformer
}
let code = `<div id="title" name={myname}><span>hello</span>world</div>`;
let ast = parser(code);
transformer(ast);
console.log(JSON.stringify(ast,null,2));