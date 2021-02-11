/**
 * 分词
 * 状态机
 */
let tokens = [];
/**
 * start表示开始
 * @param {*} char 
 */
function start(char){

}

function tokenizer(input){
    // 刚开始的时候是start的状态
    let state = start;
    for(let char of input){
        state = state(char);
    }
}

tokenizer("10+20");
console.log(tokens);