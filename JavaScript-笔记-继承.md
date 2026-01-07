---
title: JavaScript 笔记-继承
date: 2025-10-25 10:46:08
tags:
	- JavaScript
	- 笔记
categories: JavaScript笔记
---

很多面向对象语言都支持**接口继承**和**实现继承**。前者只继承**方法签名**，后者继承**实际的方法**。

`ECMAScript` 中的函数没有签名，所以**只支持实现继承**，并且通过原型链实现。


## 原型链

原型链的基本思想是<mark>通过原型继承多个引用类型的属性和方法</mark>，在实例和原型之间构造一条原型链

```javascript
function SuperType() {
    this.property = true;  // 实例属性
}

// 原型方法
SuperType.prototype.getSuperValue = function () {
    return this.property;
};

function SubType() {
    this.subproperty = false;
}

/*
    SubType 通过创建 SuperType 的实例并将其赋值给自己的原型实现对 SuperType 的继承
    SuperType 实例可以访问的所有属性和方法也会存在于 SubType.prototype

    SubType.prototype 现在是 SuperType 的一个实例
*/
SubType.prototype = new SuperType();

SubType.prototype.getSubValue = function () {
    return this.subproperty;
};

let instance = new SubType();
console.log(instance.getSuperValue());  // true
```
<br>

![原型之间的关系](SubType_SuperType.png)
<br>

> 在读取实例上的属性时，首先在实例上搜索这个属性。如果没找到，则会继承搜索实例的原型
>
> 通过原型链实现继承后，可以继承向上搜索，搜索原型的原型
>
> 对属性和方法的搜索会一直持续到原型链的末端

调用 `instance.getSuperValue()` 的搜索过程:
`instance` -> `SubType.prototype` -> `SuperType.prototype` -> `SuperType.getSuperValue()`


### 默认原型

默认情况下，<mark>所有引用类型</mark>都继承自 `Object`

- <mark>任何函数</mark>的默认原型都是一个 `Object` 的实例

- 该实例有一个内部值针指向 `Object.prototype`

- 自定义类型能够继承包括 `toString()`、`valueOf()` 在内的所有默认方法

![完整的继承原型链](prototypeChain.png)

调用 `instance.toString()` 时，实际上调用的是保存在 `Object.prototype` 上的方法


### 原型与继承关系

- 如果一个实例的原型链中出现过相应的构造函数，则 `instanceof` 返回 `true`

- 只要原型链中包含对应的原型，`isPrototypeOf()` 就返回 `true`

接[前面代码](#原型链):

```javascript
console.log(instance instanceof Object);  // true
console.log(instance instanceof SuperType);  // true
console.log(instance instanceof SubType);  // true

console.log(Object.prototype.isPrototypeOf(instance));  // true
console.log(SuperType.prototype.isPrototypeOf(instance));  // true
console.log(SubType.prototype.isPrototypeOf(instance));  // true
```


### 方法

子类覆盖父类的方法，或者增加父类没有的方法必须**在原型赋值之后再加到原型上**

以**对象字面量**方式创建原型方法会破坏之前的原型链

```javascript
function SuperType() {
    this.property = true;
}

SuperType.prototype.getSuperValue = function() {
    return this.property;
};

function SubType() {
    this.subproperty = false;
}

// 继承 SuperType
SubType.prototype = new SuperType();

/*
// 在原型赋值之后将方法加到原型上
// 新方法
SubType.prototype.getSubValue = function () {
    return this.subproperty;
};

// 覆盖已有的方法
SubType.prototype.getSuperValue = function () {
    return false;
};

let instance = new SubType();
console.log(instance.getSuperValue());  // false
*/

// 通过对象字面量添加新方法，导致 SubType.prototype = new SuperType() 无效
SubType.prototype = {
    getSubValue() {
        return this.subproperty;
    },

    someOtherMethod() {
        return false;
    }
};

let instance = new SubType();
// TypeError: instance.getSuperValue is not a function
console.log(instance.getSuperValue());
```

以**对象字面量**覆盖后的原型是一个 `Object` 的实例，不再是 `SuperType` 的实例。之前的原型链断开，`SubType` 和 `SuperType` 之间没关系了


### 原型链的问题

- 原型中包含的引用值会在所有实例间共享

- 使用原型实现继承时，原型实际上变成了另一个类型的实例，表明原先的实例属性变成了原型属性

- 子类型在实例化时不能给父类型的构造函数传参


## 盗用构造函数

- 若原型中的属性是**基本类型**（数字、字符串），实例修改时会<mark>在自身创建同名属性</mark>，不影响原型和其它实例

- 若原型中的属性是**引用类型**（数组、对象），实例修改时会<mark>直接操作原型中的引用值</mark>（实例本身没有该属性，会顺着原型链找到原型），导致**所有实例的该属性被同时修改**

为解决原型包含**引用值**导致的继承问题，<mark>在子类构造函数中调用父类构造函数</mark>，使用 `apply()` 和 `call()` 方法**以新创建的对象为上下文执行构造函数**

```javascript
function SuperType() {
    this.colors = ["red", "blue", "green"];
}

function SubType() {
    /* 
        继承 SuperType
        相当于新的 SubType 对象上运行了 SuperType() 函数中的所有初始化代码
        每个实例都会有自己的 colors 属性
    */
    SuperType.call(this);
}

let instance1 = new SubType();
instance1.colors.push("black");
// [ 'red', 'blue', 'green', 'black' ]
console.log(instance1.colors);

let instance2 = new SubType();
// [ 'red', 'blue', 'green' ]
console.log(instance2.colors);

```


### 传递参数

盗用构造函数可以在子类构造函数中向父类构造函数传参

```javascript
function SuperType(name) {
    this.name = name;
}

function SubType() {
    // 继承 SuperType 并传参
    // 实际上会在 SubType 的实例上定义 name 属性
    SuperType.call(this, "Nicholas");

    // 为确保 SuperType 构造函数不会覆盖 SubType 定义的属性
    // 可以在调用父类构造函数之后再给子类实例添加额外的属性
    this.age = 29;  // 实例属性
}

let instance = new SubType();
console.log(instance.name);  // Nicholas
console.log(instance.age);  // 29
```


### 盗用构造函数的问题

- 必须在构造函数中定义方法，函数不能重用

- 子类不能访问父类原型上定义的方法，所有类型只能使用构造函数模式


## 组合继承

组合继承综合了原型链和盗用构造函数，使用**原型链**继承原型上的**属性和方法**（共享原型方法），通过**盗用构造函数**继承**实例属性**（避免引用值共享）。既可以把方法定义在原型上实现重用，又可以让每个实例都有自己的属性。

```javascript
function SuperType(name) {
    this.name = name;
    this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function() {
    console.log(this.name);
};

function SubType(name, age) {
    // 继承属性
    SuperType.call(this, name);  // 子类构造函数，第二次调用 SuperType()

    this.age = age;
}

// 继承方法
SubType.prototype = new SuperType();  // 创建子类原型，第一次调用 SuperType()

SubType.prototype.sayAge = function() {
    console.log(this.age);
};

let instance1 = new SubType("Nicholas", 29);
instance1.colors.push("black");
// [ 'red', 'blue', 'green', 'black' ]
console.log(instance1.colors);
// Nicholas
instance1.sayName();
// 29
instance1.sayAge();


/*
    SuperType {
      name: 'Nicholas',
      colors: [ 'red', 'blue', 'green', 'black' ],
      age: 29
    }
*/
console.log(instance1);
/*
    SuperType {
      name: undefined,
      colors: [ 'red', 'blue', 'green' ],
      sayAge: [Function (anonymous)]
    }
*/
console.log(SubType.prototype);

let instance2 = new SubType("Greg", 27);
// [ 'red', 'blue', 'green' ]
console.log(instance2.colors);
// Greg
instance2.sayName();
// 27
instance2.sayAge();
```

> **组合继承是 `JavaScript` 中使用最多的继承模式**
>
> 组合继承保留了 `instanceof` 操作符和 `isPrototypeOf()` 方法识别合成对象的能力

但是，组合继承存在**效率问题**，<mark>父类构造函数始终会被调用两次</mark>：

1. 在创建子类原型时调用一次

2. 在子类构造函数中调用一次

![组合继承](combined_heritage.png)

由于调用了两次 `SuperType` 构造函数，所以有两组 `name` 和 `colors` 属性：一组在实例上，另一组在 `SubType` 的原型上


## 原型式继承

原型式继承适用于：

- 在已有对象基础上再创建一个新对象

- 不需要单独创建构造函数，但仍然需要在对象间共享信息的场合

```javascript
/*
// object() 函数会创建一个临时构造函数
// 将传入的对象赋值给这个构造函数的原型
// 本质上，object() 对传入的对象执行了一次浅复制
function object(o) {
    function F() {}
    F.prototype = o;

    // 返回临时类型的一个实例
    return new F();
}

let person = {
    name: "Nicholas",
    friends: ["Shelby", "Court", "Van"]
};

let anotherPerson = object(person);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");

let yetAnotherPerson = object(person);
yetAnotherPerson.name = "Linda";
yetAnotherPerson.friends.push("Barbie");

// [ 'Shelby', 'Court', 'Van', 'Rob', 'Barbie' ]
console.log(person.friends);
*/

let person = {
    name: "Nicholas",
    friends: ["Shelby", "Court", "Van"]
};

// ECMASCript 通过 Object.create() 方法将原型式继承的概念规范化
let anotherPerson = Object.create(person);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");

let yetAnotherPerson = Object.create(person);
yetAnotherPerson.name = "Linda";
yetAnotherPerson.friends.push("Barbie");

// [ 'Shelby', 'Court', 'Van', 'Rob', 'Barbie' ]
console.log(person.friends);
```


## 寄生式继承

寄生式继承类似寄生构造函数和工厂模式：创建一个实现继承的函数，以某种方式增强对象，然后返回这个对象

```javascript
// 可将 object() 函数替换为任何返回新对象的函数
function object(o) {
    function F() {}
    F.prototype = o;

    // 返回临时类型的一个实例
    return new F();
}

// 函数参数为新对象的基准对象
function createAnother(original) {
    // 通过调用函数创建一个新对象
    let clone = object(original);

    // 给 clone 对象添加一个新方法（以某种方式增强对象）
    clone.sayHi = function() {
        console.log("hi");
    };

    // 返回这个对象
    return clone;
}

let person = {
    name: "Nicholas",
    friends: ["Shelby", "Court", "Van"]
};

let anotherPerson = createAnother(person);
anotherPerson.sayHi();
```

> 寄生式继承适合主要关注对象，不在乎类型和构造函数的场景
>
> 通过寄生式继承给对象添加函数会导致函数难以重用


## 寄生式组合继承

寄生式组合继承<mark>通过盗用构造函数继承属性，但使用**混合式原型链**继承方法</mark>（使用寄生式继承来继承父类原型，然后将返回的新对象赋值给子类原型）解决[组合继承](#组合继承)的**效率问题**。

```javascript
function object(o) {
    function F() {}
    F.prototype = o;

    return new F();
}

// 函数接收子类构造函数和父类构造函数作为参数
function inheritPrototype(subType, superType) {
    // 创建父类原型的副本
    let prototype = object(superType.prototype);
    // 给返回的 prototype 对象设置 constructor 属性
    // 解决重写原型导致默认 constructor 丢失问题
    prototype.constructor = subType;
    // 将新创建的对象赋值给子类的原型
    subType.prototype = prototype;
}

function SuperType(name) {
    this.name = name;
    this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function() {
    console.log(this.name);
};

function SubType(name, age) {
    // 只调用一次 SuperType 构造函数，避免属性重复
    SuperType.call(this, name);

    this.age = age;
}

inheritPrototype(SubType, SuperType);

SubType.prototype.sayAge = function () {
    console.log(this.age);
};

let instance = new SubType("Nicholas", 29);
/*
    SubType {
      name: 'Nicholas',
      colors: [ 'red', 'blue', 'green' ],
      age: 29
    }

*/
console.log(instance);

/*
    SuperType {
      constructor: [Function: SubType],
      sayAge: [Function (anonymous)]
    }
*/
console.log(SubType.prototype);
```

> 使用寄生式组合继承原型链保持不变，`instanceof()` 和 `isPrototypeOf()` 正常有效
>
> 寄生式组合继承是**引用类型继承的最佳模式**
