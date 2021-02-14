let RegExpObject = /([0-9]+)|(\+)|(\*)/g;
let tokenTypes = require('./tokenTypes');
let tokenNames = [tokenTypes.NUMBER, tokenTypes.PLUS, tokenTypes.MULTIPLY];
// script = 2+3*4;
function* tokenizer(script) {
    while (true) {
        let result = RegExpObject.exec(script);
        if (!result) break;
        // 这里返回匹配项的索引
        let index = result.findIndex((item,index)=>index>0&&!!item);
        let token = {};
        token.type = tokenNames[index-1];
        token.value = result[0]; // 第一项就是匹配的内容，后面的是分组的信息
        yield token;
    }
}

function tokenize(script) {
    let tokens = [];
    debugger
    for (let token of tokenizer(script)) {
        tokens.push(token);
    }
    return new TokenReader(tokens);
}

class TokenReader{
    constructor(tokens) {
        this.tokens = tokens; // token数组
        this.pos = 0; // 索引
    }
    // 读取当前位置上的token，或者说消耗掉一个token
    read(){
        if(this.pos < this.tokens.length){
            // 读完后pos会自增 相当于用掉了这个token
            return this.tokens[this.pos++]; 
        }
        return null;
    }
    //  看的是当前的token
    peek(){
        if (this.pos < this.tokens.length) {
            // 读完后pos会自增 相当于用掉了这个token
            return this.tokens[this.pos];
        }
        return null;
    }
    // 恢复 倒退
    unread(){
        if(this.pos > 0){
            this.pos--;
        }
    }
}
let tokenReader = tokenize('2+3*4');
// console.log(tokenReader.peek()); // 2
// console.log(tokenReader.peek()); // 2
// console.log(tokenReader.peek()); // 2
// console.log(tokenReader.read()); // 2
// console.log(tokenReader.read()); // +
// console.log(tokenReader.peek()); // 3
// tokenReader.unread();
// console.log(tokenReader.peek()); // +

module.exports = tokenize;