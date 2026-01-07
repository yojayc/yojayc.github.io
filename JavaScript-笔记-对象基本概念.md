---
title: JavaScript 笔记-对象基本概念
date: 2025-10-21 19:26:15
tags:
	- JavaScript
	- 笔记
categories: JavaScript笔记
---

`ECMA-262` 使用两个中括号把特性的名称括起来，将某个特性标识为内部特性，例如 `[[Enumerable]]`

## 数据属性

- 数据属性包含一个保存数据值的位置，从这个位置读取和写入值

- 调用 `Object.defineProperty()` 如果不指定 `configurable、enumerable 和 writable`，默认都为 `false`

```javascript
// 定义一个对象，包含伪私有成员 year_ 和公共成员 edition
let book = {
	year_: 2017,  // year_ 中的下划线表示该属性不希望在对象方法的外部被访问
	edition: 1
};
```


## 访问器属性

- 访问器属性不包含数据值，包含一个获取（`getter`）函数和一个设置（`setter`）函数

- 只定义 `getter` 函数意味着属性是只读的，尝试修改属性会被忽略

- 只有一个 `setter` 函数的属性是不能读取的 


## `Object.defineProperties()` 方法可以通过多个描述符一次性定义多个属性

```javascript
let book = {};
Object.defineProperties(book, {
	/* 
        year_ 和 edition 是数据属性
	    configurable、enumerable 和 writable 特性值都是 false
        
        使用 Object.defineProperties 必须使用 Object 定义属性
        否则会报错 TypeError: Property description must be an object:
    */
	year_: {
		value: 2017
	},

	edition: {
		value: 1
	},

	// 访问器属性
	year: {
		get() {
			return this.year_;
		},

		set(newValue) {
			if(newValue > 2017) {
				this.year_ = newValue;
				this.edition += newValue - 2017;
			}
		}
	}
});
```


## 使用 `Object.getOwnPropertyDescriptor()` 方法可以取得指定属性的属性描述符

该方法接收属性所在的对象和要取得其描述符的属性名

**访问器属性**返回包含 `configurable、enumerable、get` 和 `set` 属性的对象

**数据属性**返回包含 `configurable、enumerable、writable` 和 `value` 属性的对象

```javascript
let book = {};

Object.defineProperties(book, {
    year_: {
        value: 2017
    },

    edition: {
        value: 1
    },

    year: {
        get: function() {
            return this.year_;
        },

        set: function(newValue) {
            if (newValue > 2017) {
                this.year_ = newValue;
                this.edition += newValue - 2017;
            }
        }
    }
});

let descriptor = Object.getOwnPropertyDescriptor(book, 'year_');
console.log(descriptor.value);  // 2017
console.log(descriptor.configurable);  // false
console.log(typeof descriptor.get);  // undefined

descriptor = Object.getOwnPropertyDescriptor(book, 'year');
console.log(descriptor.value);  // undefined
console.log(descriptor.enumerable);  // false
console.log(typeof descriptor.get);  // function

// Object.getOwnPropertyDescriptors() 会在每个自有属性上调用 Object.getOwnPropertyDescriptor() 并在一个新对象中返回它们
console.log(Object.getOwnPropertyDescriptors(book));
/*
{
  year_: {
    value: 2017,
    writable: false,
    enumerable: false,
    configurable: false
  },
  edition: { value: 1, writable: false, enumerable: false, configurable: false },
  year: {
    get: [Function: get],
    set: [Function: set],
    enumerable: false,
    configurable: false
  }
}
*/
```


## `Object.assign()` 方法用于合并对象

该方法接收**一个目标对象**和**一个或多个源对象**作为参数，然后将每个源对象中可枚举（`Object.propertyIsEnumerable()` 返回 `true`） 和自有（`Object.hasOwnProperty()` 返回 `true`）属性复制到目标对象

该方法会复制以字符串和符号为键的属性

对每个符合条件的属性，该方法会使用源对象上的 `[[Get]]` 取得属性的值，然后使用目标对象上的 `[[Set]]` 设置属性的值

```javascript
dest = {
    set a(val) {
        console.log(`Invoked dest setter with param ${val}`);
    }
};

src = {
    get a() {
        console.log('Invoked src getter');
        return 'foo';
    }
};

/*
	调用 src 的获取方法
	调用 dest 的设置方法并传入参数 "foo"
*/
Object.assign(dest, src);

/*
	Invoked src getter
	Invoked dest setter with param foo
	{ a: [Setter] }
*/
console.log(dest);
```

***

`Object.assign()` 对每个源对象执行**浅复制**(1.直接复制对象的基本类型值 2.引用类型数据只复制内存地址，**新旧对象共享同一份深层数据**，修改深层数据会相互影响)。如果多个源对象有相同的属性，则使用最后一个复制的值

如果赋值期间出错，操作会中止并退出，同时抛出错误


## `Object.is()` 判定相等

`Object.is()` 与 `===` 类似，但能正确处理特殊值

- `Object.is(NaN, NaN)` 返回 `true`（而 `NaN === NaN` 返回 `false`）

- `Object.is(+0, -0)` 返回 `false`（而 `+0 === -0` 返回 `true`）


## 增强的对象语法

### 简写属性名

简写属性名只要使用变量名（不用再写冒号）就会自动被解释为同名的属性键。如果没有找到同名变量，则会抛出 `ReferenceError`

下面两段代码等价

```javascript
let name = 'Matt';

let person = {
	name: name
};

console.log(person);  // { name: 'Matt' }
```

```javascript
let name = 'Matt';

let person = {
	name
};

console.log(person);  // { name: 'Matt' }
```

### 可计算属性

可计算属性可以在对象字面量中完成动态属性赋值，不用先声明对象，再使用中括号语法来添加属性

```javascript
const nameKey = 'name';
const ageKey = 'age';
const jobKey = 'job';

let person = {
	[nameKey]: 'Matt',
	[ageKey]: 27,
	[jobKey]: 'Software engineer'
};

// { name: 'Matt', age: 27, job: 'Software engineer' }
console.log(person);
```


## 对象解构

对象解构就是使用与对象匹配的结构来实现对象属性赋值，可以在一个类似对象字面量的结构中，声明多个变量，同时执行多个赋值操作。

如果引用的属性不存在，则该变量的值就是 `undefined`

```javascript
let person = {
    name: 'Matt',
    age: 27
};

let { name: personName, age: personAge } = person;

console.log(personName);  // Matt
console.log(personAge);  // 27

// let { name, age } = person;

// console.log(name);  // Matt
// console.log(age);  // 27

let { name, job } = person;

console.log(name);  // Matt
console.log(job);  // undefined
```

- 解构在内部使用函数 `ToObject()` 把数据结构转换为对象

- 在对象解构的上下文中，原始值会被当成对象

- `null` 和 `undefined` 不能被解构，否则会抛出错误

```javascript
let { length } = 'foobar';

console.log(length);  // 6

// 通过对象解构赋值，从数字 4 的「包装对象」中提取 constructor 属性，并将其赋值给变量 c
// 对象的 constructor 属性指向创建该对象的构造函数
let { constructor: c } = 4;
console.log(c === Number);  // true

let { _ } = null;  // TypeError
let { _0 } = undefined;  // TypeError
```

**如果给事先声明的变量赋值，则赋值表达式必须包含在一对括号中**

```javascript
let personName, personAge;

let person = {
    name: 'Matt',
    age: 27
};

// let {name: personName, age: personAge} = person;
({name: personName, age: personAge} = person);

console.log(personName, personAge);  // Matt, 27
```

解构赋值可以使用嵌套解构，以匹配嵌套的属性

```javascript
let person = {
    name: 'Matt',
    age: 27,
    job: {
        title: 'Software Engineer'
    }
};

// 声明 title 变量并将 person.job.title 的值赋给它
let { job: { title } } = person;
console.log(title);  // Software Engineer
```

- 在源对象或目标对象外层属性没有定义的情况下不能使用嵌套解构

- 如果一个解构表达式涉及多个赋值，开始的赋值成功而后面的赋值出错，则整个解构赋值只会完成一部分


