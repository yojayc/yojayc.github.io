---
title: JavaScript 笔记-代理模式
date: 2025-10-30 17:45:50
tags:
	- JavaScript
	- 笔记
categories: JavaScript笔记
---

## 跟踪属性访问

通过捕获 `get`、`set` 和 `has` 等操作，可以知道什么时候访问和查询过对象属性

```javascript
const user = {
    name: 'Jake'
};

const proxy = new Proxy(user, {
    get(target, property, receiver) {
        console.log(`Getting ${property}`);

        return Reflect.get(...arguments);
    },

    set(target, property, value, receiver) {
        console.log(`Setting ${property}=${value}`);

        return Reflect.set(...arguments);
    }
});

proxy.name;  // Getting name
proxy.age = 27;  // Setting age=27
```


## 隐藏属性

代理的内部实现对外部代码不可见，能方便地隐藏目标对象上的属性

```javascript
const hiddenProperties = ['foo', 'bar'];

const targetObject = {
    foo: 1,
    bar: 2,
    baz: 3
};

const proxy = new Proxy(targetObject, {
   get(target, property) {
       if(hiddenProperties.includes(property)) {
           return undefined;
       }
       else {
           return Reflect.get(...arguments);
       }
   },

   has(target, property) {
       if(hiddenProperties.includes(property)) {
           return false;
       }
       else {
           return Reflect.has(...arguments);
       }
   }
});

// 调用 get() 代理
console.log(proxy.foo);  // undefined
console.log(proxy.bar);  // undefined
console.log(proxy.baz);  // 3

// 调用 has() 代理
console.log('foo' in proxy);  // false
console.log('bar' in proxy);  // false
console.log('baz' in proxy);  // true
```


## 属性验证

所有赋值操作都会触发 `set()` 捕获器，可以根据所赋的值决定允许还是拒绝赋值

```javascript
const target = {
    onlyNumbersGoHere: 0
};

const proxy = new Proxy(target, {
    set(target, property, value) {
        if(typeof value !== 'number') {
            return false;
        }
        else {
            return Reflect.set(...arguments);
        }
    }
});

proxy.onlyNumbersGoere = 1;
console.log(proxy.onlyNumbersGoere);  // 1

proxy.onlyNumbersGoere = '2';
console.log(proxy.onlyNumbersGoere);  // 1
```


## 函数与构造函数参数验证

可以审查函数和构造函数参数，让函数只接收某种类型的值

```javascript
function median(...nums) {
    return nums.sort()[Math.floor(nums.length / 2)];
}

const proxy = new Proxy(median, {
    /*
        target: 目标对象
        thisArg: 调用函数时的 this 参数
        argumentsList: 调用函数时的参数列表
    */
    apply(target, thisArg, argumentsList) {
        for(const arg of argumentsList) {
            if(typeof arg !== 'number') {
                throw 'Non-number argument provided';
            }
        }

        return Reflect.apply(...arguments);
    }
});

console.log(proxy(4, 7, 1));  // 4
console.log(proxy(4, '7', 1));  // Non-number argument provided
```

可以要求实例化时必须给构造函数传参

```javascript
class User {
    constructor(id) {
        this.id_ = id;
    }
}

const proxy = new Proxy(User, {
    /*
        target: 目标构造函数
        argumentsList: 传给目标构造函数的参数列表
        newTarget: 最初被调用的构造函数
    */
    construct(target, argumentsList, newTarget) {
        if(argumentsList[0] === undefined) {
            throw 'User cannot be instantiated without id';
        }
        else {
            return Reflect.construct(...arguments);
        }
    }
});

new proxy(1);

new proxy();  // User cannot be instantiated without id
```


## 数据绑定与可观察对象

通过代理可以联系运行时原本不相关的部分，实现各种模式，让不同的代码互操作

比如，可以将被代理的类绑定到一个全局实例集合，让所有创建的实例都被添加到这个集合

```javascript
const userList = [];

class User {
    constructor(name) {
        this.name_ = name;
    }
}

const proxy = new Proxy(User, {
    construct() {
        const newUser = Reflect.construct(...arguments);
        userList.push(newUser);

        return newUser;
    }
});

new proxy('John');
new proxy('Jacob');
new proxy('Jingleheimerschmidt');

/*
[
  User { name_: 'John' },
  User { name_: 'Jacob' },
  User { name_: 'Jingleheimerschmidt' }
]
*/
console.log(userList);
```

也可以把集合绑定到一个事件分派程序，每次插入新实例都会发送消息

```javascript
const userList = [];

function emit(newValue) {
    console.log(newValue);
}

const proxy = new Proxy(userList, {
    /*
        set拦截器对所有属性设置操作都会响应，包括length属性的更新
        每次push会触发两次emit调用：
            一次是新元素被添加时（输出 'John' 和 'Jacob'）
            一次是数组长度被更新时（输出 1 和 2）

        target: 目标对象
        property: 引用的目标对象上的字符串键属性
        value: 要赋给属性的值
        receiver: 接收最初赋值的对象
    */
    set(target, property, value, receiver) {
        const result = Reflect.set(...arguments);
        if(result) {
            /*
                target: 目标对象
                property: 引用的目标对象上的字符串键属性
                receiver: 代理对象或继承代理对象的对象
            */
            emit(Reflect.get(target, property, receiver));
        }

        return result;
    }
});

// push 是数组的方法，在添加元素后，会返回数组的新长度
// John
// 1
proxy.push('John');
// Jacob
// 2
proxy.push('Jacob');
```
