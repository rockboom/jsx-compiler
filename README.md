# jsx-compiler
这样的文法结构不会出现左递归，但是结合性不对，计算顺序错了 2+3+4 -> (2+(3+4))
```js
add -> multiple | multiple + add
multiple -> NUMBER | NUMBER * (add)
```

## TODO
在进行连除运算时会出错 原因是运算符的结合性问题
加减乘除 都是从左往右结合
```js
5-1+4/2/2*3 // 期待7 实际结果为16
```
后期需要用结合性来进行处理
正确的文法结构如下所示，这样的结合性才是正确的，计算顺序就是从左往右计算
```js
add -> add | add + multiple
multiple -> multiple | multiple*NUMBER
```
但上面的文法结构又会出现左递归的问题