const {parser} = require('./parser');
const nodeTypes = require('./nodeTypes');
function traverse(ast,visitor){
    function traverseArray(array,parent){
        array.forEach(child => {
            traverseNode(child);
        });
    }
    // 
    function traverseNode(node,parent){
        let method = visitor[node.type];
        // 当开始遍历子节点 要执行进入方法
        if(method){
            if(typeof method === 'function') {
                method({node},parent);
            }else{
                method.enter({node},parent);
            }
        }
        switch(node.type){
            case nodeTypes.Program:
                traverseArray(node.body,node);
                break;
            case nodeTypes.ExpressionStatement:
                traverseNode(node.expression);
                break;
            case nodeTypes.JSXElement:
                debugger
                traverseNode(node.openingElement,node);
                traverseArray(node.children, node);
                traverseNode(node.closingElement,node);
                break;
            case nodeTypes.openingElement:
                traverseNode(node.name,node);
                traverseArray(node.attributes, node);
                break;
            case nodeTypes.JSXAttribute:
                traverseNode(node.name,node);
                traverseNode(node.value,node);
            case nodeTypes.closingElement:
                traverseNode(node.name, node);
                break;
            case nodeTypes.JSXIdentifier:
            case nodeTypes.JSXText:
            case nodeTypes.Literal:
                break;
            default:
                break;
        }
        // 当遍历完子节点 离开此节点的时候要执行离开方法
        if(method && method.exit){
            method.exit({node},parent);
        }
    }
    traverseNode(ast,null);
}
module.exports = {
    parser
}
let sourceCode = '<div id="title" name={myname}><span>hello</span>world</div>';
let ast = parser(sourceCode);
traverse(ast,{
    JSXOpeningElement:{
        enter:(nodePath,parent)=>{
            console.log(`进入开始元素:`,nodePath.node);
        },
        exit:(nodePath,parent)=>{
            console.log(`离开开始元素:`,nodePath.node);
        }
    },
    JSXClosingElement(nodePath, parent){
        console.log(`进入结束元素:`, nodePath.node);
    }
})