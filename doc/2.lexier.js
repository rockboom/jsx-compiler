/**
 * 分词
 * 状态机
 */
let NUMNBERS = /[0-9]/;
const Numberic = 'Numberic';
const Punctuator = 'Punctuator';
let tokens = [];
/**
 * start表示开始状态函数
 * 它是一个函数，接收一个字符，返回下一个状态函数
 * @param {*} char 
 */
let currentToken;
// 确定一个新的token
function emit(token){
    currentToken = {type:"",value:""};
    tokens.push(token);
}
function start(char){// char = 1
    if(NUMNBERS.test(char)){ // 如果char是一个数字
        currentToken = {type:Numberic,value:''};
    }
    // 进入新的状态了，什么状态？就是收集或者捕获number数字的状态
    return number(char);
}
function number(char){
    if (NUMNBERS.test(char)) { // 如果char是一个数字
        currentToken.value += char;
        return number;
    } else if (char === "+" || char === "-") {
        emit(currentToken);
        emit({type:Punctuator,value:char});
        currentToken = {
            type: Numberic,
            value: ''
        };
        return number;
    }
    return 
}

function tokenizer(input){
    // 刚开始的时候是start的状态
    let state = start; // 每一次的行为都不一样 所以需要用一个单独的变量存储
    for(let char of input){
        state = state(char); // 根据char的值决定下一个状态
    }
    
    if(currentToken.value.length > 0){
        emit(currentToken);
    }
}

tokenizer("10+20");
console.log(tokens);