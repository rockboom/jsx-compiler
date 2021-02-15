const {tokenizer} = require('./tokenizer'); // 标识符token
const tokenTypes = require('./tokenTypes'); // token类型
const nodeTypes = require('./nodeTypes'); // ast结点类型
/* 
token流 <div id="title" name={myname}><span>hello</span>world</div>
jsxElement => < JSXIdentifier attribute * > child * < /JSXIdentifier>
attribute => AttributeKey = "AttributeStringValue"
child => jsxElement | JSXText
 */
function parser(sourceCode){
    let tokens = tokenizer(sourceCode); // tokens数组
    let pos = 0; //当前的token索引 pos 默认0
    function walk(parent){
        let token = tokens[pos]; // 取出当前token peek
        let nextToken = tokens[pos + 1]; // 取出下一个token peek下一个
        // jsxElement规则
        if(token.type === tokenTypes.LeftParentheses // 当前是<，下一个是token标识符，说明他就是一个JSX元素的标识符
            && nextToken.type === tokenTypes.JSXIdentifier){
                let node = {
                    type:nodeTypes.JSXElement,
                    openingElement:null,
                    closingElement:null,
                    children:[]
                }
                // 第一步给开始元素赋值
                let token = tokens[++pos]; // div
                node.openingElement = {
                    type:nodeTypes.JSXOpeningElement,
                    name:{
                        type:nodeTypes.JSXIdentifier,
                        name:token.value // h1
                    },
                    attributes:[]
                }
                token = tokens[++pos]; // AttributeKey = id
                // 循环给属性数组赋值
                while(token.type === tokenTypes.AttributeKey){
                    node.openingElement.attributes.push(walk());
                    token = tokens[pos];
                }
                // pos 指向谁 <div id="title" name={myname}><span>hello</span>world</div>
                token = tokens[++pos]; // 直接跳过 >，获取 <
                nextToken = tokens[pos+1];
                // child => jsxElement | JSXText
                while(token.type !== tokenTypes.LeftParentheses // 对应文本类型子节点
                    // 对应元素类型子节点 子元素开始的位置
                    || (token.type === tokenTypes.LeftParentheses && nextToken.type !== tokenTypes.BackSlash)){
                    node.children.push(walk());
                    token = tokens[pos];
                    nextToken = tokens[pos+1];
                }
                node.closingElement = walk(node);
                return node;
                // while结束之后
        // attribbute 规则
        }else if(token.type === tokenTypes.AttributeKey){
            let nextToken = tokens[++pos]; // value
            let node = {
                type:nodeTypes.JSXAttribute,
                name:{
                    type:nodeTypes.JSXAttribute,
                    name:token.value, // id
                },
                value:{
                    type:nodeTypes.Literal,
                    value:nextToken.value
                }
            }
            pos++;// 到属性值后面的token了
            return node;
        // JSXText 规则
        }else if(token.type === tokenTypes.JSXText){
            pos++;
            return {
                type:nodeTypes.JSXText,
                value:token.value
            }
        // 处理结束标签 </
        }else if(parent 
            && token.type === tokenTypes.LeftParentheses // <
            && nextToken.type === tokenTypes.BackSlash // /
            ){
                pos++; // 跳过 <
                pos++; // 跳过 /
                token = tokens[pos]; // span 或h1
                pos++; // 跳过 span
                pos++; // 跳过 >
                if(parent.openingElement.name.name !== token.value){
                    throw new Error(`开始标签[${parent.openingElement.name.name}]和结束标签[${token.value}]不匹配`);
                }
                return {
                    type:nodeTypes.JSXClosingElement,
                    name:{
                        type:nodeTypes.JSXIdentifier,
                        name:token.value
                    }
                }
        }
        // throw new Error('不可能走到这');
    }
    let ast = {
        type:nodeTypes.Program,
        body:[
            {
                type:nodeTypes.ExpressionStatement,
                expression:walk()
            }
        ]
    }
    return ast;
}

module.exports = {
    parser
};

// let sourceCode = '<div id="title" name={myname}><span1>hello</span>world</div>';
// console.log(JSON.stringify(parser(sourceCode),null,2));

/* 
jsxElement => < JSXIdentifier attribute* > child* < /JSXIdentifier>
attribute => AttributeKey = "AttributeStringValue"
child => jsxElement|JSXText
[
  { type: 'LeftParentTheses', value: '<' },
  { type: 'JSXIdentifier', value: 'div' },
  { type: 'AttributeKey', value: 'id' },
  { type: 'AttributeStringValue', value: '"title"' },
  { type: 'AttributeKey', value: 'name' },
  { type: 'AttributeExpressionValue', value: '{myname}' },
  { type: 'RightParentheses', value: '>' },
  { type: 'LeftParentTheses', value: '<' },
  { type: 'JSXIdentifier', value: 'span' },
  { type: 'RightParentheses', value: '>' },
  { type: 'JSXText', value: 'hello' },
  { type: 'LeftParentTheses', value: '<' },
  { type: 'JSXIdentifier', value: '/span' },
  { type: 'RightParentheses', value: '>' },
  { type: 'JSXText', value: 'world' },
  { type: 'LeftParentTheses', value: '<' },
  { type: 'JSXIdentifier', value: '/div' },
  { type: 'RightParentheses', value: '>' }
]
*/