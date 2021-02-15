
const ASTNode = require('./ASTNode');
const nodeTypes = require('./nodeTypes');
const tokenTypes = require('./tokenTypes');
/* 
这个是标准正常的文法
这样表示的文法转成的语法树是正确的
但是我们用递归下降算法实现这个文法的时候出现了左递归 即死循环
add - > multiple | add + multiple
multiple - > NUMBER | multiple * NUMBER

*/
/* 
为了解决左递归问题 变成 把递归放在右边
2+3+4
additive - > multiple | multiple[+ -] additive 包括 + -
multiple -> primary | primary [* /] * multiple 包括 * / 
primary - > NUMBER | (additive) 基础规则
*/
/*
采用巴科范式来表示文法
2+3+4 文凡中的 + 是算式中的加法符号 * 是正则表达式语法中的表示0个或多个
2 +3 +4 +5
3 *4 *5

2+3+4*5*6

 additive => multiple (+ multiple)*
 multiple => number (* number)*
 */
function toAST(tokenReader){
    let rootNode = new ASTNode(nodeTypes.Program);
    // 开始推导了 加法 乘法 先推导加法
    // 实现的时候 每一个规则都是一个函数 addtive对应加法规则
    let child = additive(tokenReader);
    if(child){
        rootNode.appendChild(child);
    }
    return rootNode;
}

// additive -> minus | minus + additive
function additive(tokenReader){
    let child1 = minus(tokenReader);
    let node = child1;
    let token = tokenReader.peek(); // 看下一个符号是不是加号
    if(child1 != null && token != null){
        if(token.type === tokenTypes.PLUS){ // 如果后面的加号的话
            token = tokenReader.read(); // 把加号读出来 并且消耗掉
            let child2 = additive(tokenReader);
            if(child2 != null){
                node = new ASTNode(nodeTypes.Additive);
                node.appendChild(child1);
                node.appendChild(child2);
            }
        }
    }
    return node;
}

// minus -> multiple | multiple - minus
function minus(tokenReader) {
    let child1 = multiple(tokenReader);
    let node = child1;
    let token = tokenReader.peek(); // 看下一个符号是不是加号
    if (child1 != null && token != null) {
        if (token.type === tokenTypes.MINUS) { // 如果后面的加号的话
            token = tokenReader.read(); // 把加号读出来 并且消耗掉
            let child2 = minus(tokenReader);
            if (child2 != null) {
                node = new ASTNode(nodeTypes.Minus);
                node.appendChild(child1);
                node.appendChild(child2);
            }
        }
    }
    return node;
}
// multiple -> divide | divide * multiple
function multiple(tokenReader){
    let child1 = divide(tokenReader); // 先匹配出number 但是乘法规则并没有匹配结束
    let node = child1;// node = 3
    let token = tokenReader.peek(); // +
    if(child1 != null && token != null){
        if (token.type === tokenTypes.MULTIPLY){
            token = tokenReader.read();// 读取下一个token
            let child2 = multiple(tokenReader); // 4
            if(child2 != null){
                node = new ASTNode(nodeTypes.Multiplicative);
                node.appendChild(child1);
                node.appendChild(child2);
            }
        }
    }
    return node;
}

// divide - > primary | primary / divide 包括 /
function divide(tokenReader) {
    let child1 = primary(tokenReader); // 先匹配出number 但是乘法规则并没有匹配结束
    let node = child1; // node = 3
    let token = tokenReader.peek(); // +
    if (child1 != null && token != null) {
        if (token.type === tokenTypes.DIVIDE) {
            token = tokenReader.read(); // 读取下一个token
            let child2 = divide(tokenReader); // 4
            if (child2 != null) {
                node = new ASTNode(nodeTypes.Divide);
                node.appendChild(child1);
                node.appendChild(child2);
            }
        }
    }
    return node;
}

// primary - > NUMBER | (additive) 基础规则
function primary(tokenReader) {
    let node = number(tokenReader);
    if(!node){
        let token = tokenReader.peek();
        if(token != null && token.type === tokenTypes.LEFT_PARA){
            tokenReader.read();
            node = additive(tokenReader);
            tokenReader.read();
        }
    }
    return node;
}
function number(tokenReader) {
    let node = null;
    let token = tokenReader.peek(); // 看看当前的这个token
    // 如果能取出token 并且token的类型是数字的话 匹配上了
    if(token != null && token.type === tokenTypes.NUMBER ){
        token = tokenReader.read(); // 读取并消耗掉这个token
        // 创建一个新的语法树节点
        node = new ASTNode(nodeTypes.Numberic,token.value);
    }
    return node;
}
module.exports = toAST;