---
title: JavaScript 笔记-创建对象
date: 2025-10-22 17:03:56
tags:
	- JavaScript
	- 笔记
categories: JavaScript笔记
---

`ECMAScript 6` 开始正式支持类和继承

## 构造函数

按照惯例，构造函数名称的**首字母**都是**大写**的，非构造函数则以小写字母开头

**`ECMAScript` 中的函数是对象**，每次定义函数时，都会初始化一个对象

使用 `new` 操作符调用构造函数创建对象实例会执行如下操作：

> (1) 在内存中创建一个新对象
>
> (2) 新对象内部的 `[[Protoype]]` 特性被赋值为构造函数的 `prototype` 属性
>
> (3) 构造函数内部的 `this` 被赋值为这个新对象(即 `this` 指向新对象)
>
> (4) 执行构造函数内部的代码(给新对象添加属性)
>
> (5) 构造函数返回非空对象，则返回该对象；否则，返回刚创建的新对象


### `instanceof` 操作符用于确定对象类型

```javascript
// 函数（Function）：是一种「可执行的对象」，它除了具备对象的所有特性（可存储属性、有原型等），还额外拥有「可调用性」（可以被执行，有参数和返回值）
// 函数是「能执行的对象」，对象是「函数创建的实例或数据集合」
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function() {
        console.log(this.name);
    };
}

let person1 = new Person("Nicholas", 29, "Software Engineer");
let person2 = new Person("Greg", 27, "Doctor");

// Object 是所有对象的基类（原型链的顶端），几乎所有对象都直接或间接继承自 Object.prototype
console.log(person1 instanceof Object);  // true
console.log(person1 instanceof Person);  // true
console.log(person2 instanceof Object);  // true
console.log(person2 instanceof Person);  // true
```


### 实例化不传参数时，构造函数后面的括号可加可不加。只要有 `new` 操作符，就可以调用相应的构造函数

```javascript
function Person() {
    this.name = "Jake";
    this.sayName = function() {
        console.log(this.name);
    };
}

let person1 = new Person();
let person2 = new Person;
```


### 构造函数也是函数

- 任何函数只要使用 `new` 操作符调用就是构造函数，而不使用 `new` 操作符调用的函数就是普通函数

- 没有使用 `new` 操作符调用构造函数，结果会将属性和方法添加到 `window` 对象

- 在调用一个函数没有明确设置 `this` 值(没有作为对象的方法调用，或没有使用 `call()/apply()` 调用)，`this` 始终指向 `Global` 对象(浏览器中为 `window` 对象)

```javascript
// 只有浏览器环境中才有 window 对象
// 在 Node.js 环境中执行会报错 ReferenceError: window is not defined
window = global

function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function() {
        console.log(this.name);
    };
    // 与 sayName 逻辑上等价
    this.sayName1 = new Function("console.log(this.name)");
}

let person = new Person("Nicholas", 29, "Software Engineer");
person.sayName();  // Nicholas

Person("Greg", 27, "Doctor");
window.sayName();  // Greg

let o = new Object();
/* 
    call() 是函数对象的一个方法，用于调用函数并指定函数执行时的 this 指向
    将对象 o 指定为 Person() 内部的 this 值
    所有属性和 sayName() 方法都会添加到对象 o
*/
Person.call(o, "Kristen", 25, "Nurse");
o.sayName();  // Kristen
```


## 原型模式

每个函数都会创建一个 `prototype` 对象属性，包含应该由特定引用类型的实例共享的属性和方法

当通过构造函数创建实例时，实例会自动「关联」到该原型对象，从而可以共享原型对象中的属性和方法，避免重复定义

```javascript
function Person() {}
// let Person = function() {};  // 等价函数表达式

// 在构造函数中直接赋给对象实例的值，可以直接赋给它们的原型
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function () {
    console.log(this.name);
};

let person1 = new Person();
person1.sayName();  // Nicholas

let person2 = new Person();
person2.sayName();  // Nicholas

console.log(person1.sayName == person2.sayName);  // true

// [Function: Person]
console.log(Person.prototype.constructor);

/*
取得对象的原型

{
  name: 'Nicholas',
  age: 29,
  job: 'Software Engineer',
  sayName: [Function (anonymous)]
}
*/
console.log(Object.getPrototypeOf(person1));
console.log(Object.getPrototypeOf(person2));
```


### 概念理解

只要创建一个函数，就会按照特定的规则为这个函数创建一个 `prototype` 属性（指向原型对象）。默认情况下，**所有原型对象自动获得一个名为 `constructor` 的属性，指向与之关联的构造函数**

[前面代码](#原型模式)中的 `Person.prototype.constructor` 指向 `Person`

自定义构造函数时，原型对象默认只会获得 `constructor` 属性，其它所有方法都继承自 `Object`

每次调用构造函数创建一个新实例，该实例的内部 `[[Prototype]]` 指针就会被赋值为构造函数的原型对象。浏览器会在每个对象上暴露可以访问原型对象的 `__proto__` 属性

**实例与构造函数原型之间有直接的联系，但实例与构造函数之间没有联系**

构造函数通过 `prototype` 指向原型对象，实例通过 `__proto__` 关联原型对象

![构造函数、原型对象和对象之间的关系](person.prototype.png)

- `Person.prototype` 指向原型对象，而 `Person.prototpye.constructor` 指向 `Person` 构造函数

- 原型对象包含 `constructor` 属性和其他后来添加的属性

- 两个实例都没有属性和方法，但可以正常调用 `sayName()` 函数<br><br>


> 使用 `Object.getPrototypeOf()` 可以取得一个对象的原型
> 
> 为避免使用 `Object.setPrototypeOf()` 可能造成的性能下降，可以通过 `Object.create()` 创建一个新对象，同时为其指定原型

```javascript
let biped = {
    numLegs: 2
};

let person = Object.create(biped);
person.name = 'Matt';

console.log(person.name);  // Matt
console.log(person.numLegs);  // 2
console.log(Object.getPrototypeOf(person) === biped);  // true
```


### 层级

通过对象访问属性时，如果在对象实例上发现了给定的名称，则返回该名称对应的值。否则，会沿着指针进入原型对象，在原型对象上找到属性，再返回对应的值

只要给对象实例添加一个属性，这个属性就会**遮蔽**原型对象上的同名属性。使用 `delete` 操作符可以完全删除实例上的属性，让标识符解析过程能够继续搜索原型对象

`hasOwnProperty()` 方法会在属性存在于调用它的对象实例上时返回 `true`

```javascript
function Person() {}

Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function() {
    console.log(this.name);
};

let person1 = new Person();
let person2 = new Person();

person1.name = "Greg";
console.log(person1.name);  // Greg
console.log(person2.name);  // Nicholas

console.log(person1.hasOwnProperty("name"));  // true

delete person1.name;
console.log(person1.name);  // Nicholas
console.log(person1.hasOwnProperty("name"));  // false
```
<br>

> `ECMAScript` 的 `Object.getOWnPropertyDescriptor()` 方法只对实例属性有效
>
> 必须直接在原型对象上调用 `Object.getOwnPropertyDescriptor()` 获得原型属性的描述符


### `in` 操作符

`in` 操作符会在可以通过对象访问指定属性时返回 `true`

```javascript
function Person() {}

Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function() {
    console.log(this.name);
};

let person1 = new Person();

console.log(person1.hasOwnProperty("name"));  // false
console.log("name" in person1);  // true
```

要确定原型上是否存在某个属性，可以同时使用 `hasOwnProperty()` 和 `in` 操作符

```javascript
function hasPrototypeProperty(object, name) {
    // 通过对象可以访问时，in 操作符返回 true
    // hasOwnProperty() 只有实例上存在属性时才返回 true
    // in 操作符返回 true 且 hasOwnProperty() 返回 false 为原型属性
    return !object.hasOwnProperty(name) && (name in object);
}

function Person() {}

Person.prototype.name = "Nicholas";
Person.prototype.age = 30;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function() {
    console.log(this.name);
};

let person = new Person();
console.log(hasPrototypeProperty(person, "name"));  // true

person.name = "Greg";
console.log(hasPrototypeProperty(person, "name"));  // false
```

`Object.keys()` 可以获得对象上所有可枚举的实例属性

```javascript
function Person() {}

Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function() {
    console.log(this.name);
};

let keys = Object.keys(Person.prototype);
console.log(keys);  // [ 'name', 'age', 'job', 'sayName' ]

let p1 = new Person();
p1.name = "Rob";
p1.age = 50;

let p1keys = Object.keys(p1);
console.log(p1keys);  // [ 'name', 'age' ]

// 无论是否可以枚举，Object.getOWnPropertyNames() 都可以列出所有实例属性
let keys1 = Object.getOwnPropertyNames(Person.prototype);
// 返回的结果中包含一个不可枚举的属性 constructor
console.log(keys1);  // [ 'constructor', 'name', 'age', 'job', 'sayName' ]
```

`Object.geOwnPropertySymbols()` 用于获取对象自身所有 **`Symbol` 类型属性**（不包含继承的 `Symbol` 属性），与 `Object.getOwnPropertyNames()` 类似，但专门针对 `Symbol` 类型的属性（普通字符串属性不会被返回）


### 属性枚举顺序

`for-in` 循环和 `Object.keys()` 的枚举顺序时不确定的，取决于 `JavaScript` 引擎，可能因浏览器而异

`Object.getOwnPropertyNames()`、`Object.getOwnPropertySymbols()` 和 `Object.assign()` <mark>先以升序枚举数值键</mark>，然后<mark>以插入顺序枚举字符串和符号键</mark>。

在对象字面量中定义的键以它们逗号分割的顺序（**键值对的书写顺序**）插入

```javascript
let k1 = Symbol('k1'),
    k2 = Symbol('k2');

let o = {
    1: 1,
    first: 'first',
    [k2]: 'sym2',
    second: 'second',
    0: 0
};

o[k1] = 'sym2';
o[3] = 3;
o.third = 'third';
o[2] = 2;

// [ '0', '1', '2', '3', 'first', 'second', 'third' ]
console.log(Object.getOwnPropertyNames(o));

// [ Symbol(k2), Symbol(k1) ]
console.log(Object.getOwnPropertySymbols(o));
```


## 对象迭代

静态方法 `Object.values()` 和 `Object.entries()` 用于将对象内容转换为可迭代序列化的格式

- 这两个方法接收一个对象

- `Object.values()` 返回**对象值的数组**

- `Object.entries()` 返回**键/值对的数组**

- 非字符串属性会被转换为字符串输出

```javascript
const sym = Symbol();

const o = {
    foo: 'bar',
    baz: 1,
    qux: {},
    [sym]: 'foo'
};

// 符号属性 sym 会被忽略
// [ 'bar', 1, {} ]
console.log(Object.values(o));

// [ [ 'foo', 'bar' ], [ 'baz', 1 ], [ 'qux', {} ] ]
console.log(Object.entries(o));

// 这两个方法执行对象的浅复制
console.log(Object.values(o)[0] === o.foo);  // true
/* 
    Object.entries(o)[0]: ['foo', 'bar']
    Object.entries(o)[0][1]: 'bar'
    o.foo: 'bar'
*/
console.log(Object.entries(o)[0][1] === o.foo);  // true
```


### 其他原型语法

为了减少代码冗余，通常直接通过一个包含所有属性和方法的对象字面量来重写原型

```javascript
function Person() {}

Person.prototype = {
    // 防止 constructor 属性指向 Object 构造函数
    constructor: Person,
    name: "Nicholas",
    age: 29,
    job: "Software Engineer",
    sayName() {
        console.log(this.name);
    }
};

let friend = new Person();

console.log(friend instanceof Object);  // true
console.log(friend instanceof Person);  // true
console.log(friend.constructor == Person);  // true
console.log(friend.constructor == Object);  // false

// 与 constructor: Person 等价操作
// Object.defineProperty(Person.prototype, "constructor", {
//     enumerable: false,
//     value: Person
// });
```


### 原型动态性

从原型上搜索值的过程是动态的，即使实例在修改原型之前已经存在，任何时候对原型所作的修改也会在实例上反映出来

原因：实例和原型之间使用指针链接，而不是保存的副本

```javascript
function Person() {}

Person.prototype = {
    // constructor: Person,
    name: "Nicholas",
    age: 29,
    job: "Software Engineer",
    sayName() {
        console.log(this.name);
    }
};

let friend = new Person();

// 创建 friend 实例后添加 sayHi() 方法
Person.prototype.sayHi = function() {
    console.log("hi");
};

// friend 仍然可以访问 sayHi() 方法
friend.sayHi();  // hi
```

重写整个原型会切断最初原型与构造函数的联系，但实例引用的仍然是最初的原型

```javascript
function Person() {}

let friend = new Person();

Person.prototype = {
    constructor: Person,
    name: "Nicholas",
    age: 29,
    job: "Software Engineer",
    sayName() {
        console.log(this.name);
    }
};

// friend 指向的还是最初的原型，并没有 sayName() 属性
friend.sayName();  // TypeError: friend.sayName is not a function
```
<br>

![重写原型后的对应关系](rewrite_prototype.png)


### 原生对象原型

所有原生引用类型的构造函数（包括 `Object`、`Array`、`String` 等）都在原型上定义了实例方法

可以像修改自定义对象原型一样修改原生对象原型，随时可以添加方法

```javascript
// 给 String 原始值包装类型的实例添加一个 startsWith() 方法
// 当前环境下所有的字符串都可以使用这个方法
String.prototype.startsWith = function (text) {
    return this.indexOf(text) === 0;
};

let msg = "Hello world!";
// 读取 msg 的属性时，后台会自动创建 String 的包装实例（JavaScript 临时创建的对应的对象类型实例）
// 找到并调用 startsWith() 方法
console.log(msg.startsWith("Hello"));
```

> 推荐创建一个自定义的类，继承原生类型
> 不推荐修改原生对象原型，直接修改原生对象类型可能引发命名冲突


### 原型的问题

原型弱化了向构造函数传递初始化参数的能力，会导致所有实例默认都取得相同的属性值

原型最主要问题源自它的**共享特性**

```javascript
function Person() {}

Person.prototype = {
    constructor: Person,
    name: "Nicholas",
    age: 29,
    job: "Software Engineer",
    friends: ["Shelby", "Court"],
    sayName() {
        console.log(this.name);
    }
};

let person1 = new Person();
let person2 = new Person();

person1.friends.push("Van");

console.log(person1.friends);  // [ 'Shelby', 'Court', 'Van' ]
console.log(person2.friends);  // [ 'Shelby', 'Court', 'Van' ]
console.log(person1.friends === person2.friends);  // true
```

由于 `friends` 属性存在于 `Person.prototype` 而非 `person1` 上，新加的 "Van" 也会在 `person2.friends` 上反映出来

一般不同的实例应该有属于自己的属性副本，所以在实际开发中通常不单独使用原型模式
