---
title: JavaScript 笔记-代理捕获器与反射方法
date: 2025-10-30 14:49:36
tags:
	- JavaScript
	- 笔记
categories: JavaScript笔记
---

在代理对象上执行的任何一种操作，<mark>只会调用一个捕获处理程序</mark>，不存在重复捕获。

只要在代理上调用，所有捕获器都会拦截它们对应的反射 `API` 操作。


## get()

获取属性值的操作会调用 `get()` 捕获器，对应反射 `API` 方法 `Reflect.get()` 

```javascript
const myTarget = {};

const proxy = new Proxy(myTarget, {
	/*
		target: 目标对象
		property: 引用的目标对象上的字符串键属性
		receiver: 代理对象或继承代理对象的对象
	*/
    get(target, property, receiver) {
        console.log('get()');

        return Reflect.get(...arguments);
    }
});

proxy.foo;  // get()
```

`get()` 捕获器无返回值限制，会拦截 `proxy.property`、`proxy[property]`、`Object.create(proxy)[property]` 和 `Reflect.get(proxy, property, receiver)` 操作。

如果：

- `target.property` **不可写且不可配置**，处理程序返回的值必须与 `target.property` 匹配

- `target.property` **不可配置**且 `[[Get]]` 为 `undefined`，处理程序的返回值也必须是 `undefined`


## set()

设置属性值的操作会调用 `set()` 捕获器，对应反射 `API` 方法 `Reflect.set()`

```javascript
const myTarget = {};

const proxy = new Proxy(myTarget, {
	/*
		target: 目标对象
		property: 引用的目标对象上的字符串键属性
		value: 要赋给属性的值
		receiver: 接收最初赋值的对象
	*/
    set(target, property, value, receiver) {
        console.log('set()');

        return Reflect.set(...arguments);
    }
});

proxy.foo = 'bar';  // set()
```

`set()` 捕获器返回 `true` 表示成功；返回 `false` 表示失败，严格模式会抛出 `TypeError`。会拦截 `proxy.property = value`、`proxy[property] = value`、`Object.create(proxy)[property] = value` 和 `Reflect.set(proxy, property, value, receiver)` 操作。

如果：

- `target.property` <mark>不可写且不可配置</mark>，则不能修改目标属性的值

- `target.property` <mark>不可配置且 `[[Set]]` 特性为 `undefined`</mark>，则不能修改目标属性的值


## has()

在 `in` 操作符中会调用 `has()` 捕获器，对应反射 `API` 方法 `Reflect.has()`

```javascript
const myTarget = {};

const proxy = new Proxy(myTarget, {
	/*
		target: 目标对象
		property: 引用的目标对象上的字符串键属性
	*/
    has(target, property) {
        console.log('has()');

        return Reflect.has(...arguments);
    }
});

'foo' in proxy;  // has()
```

`has()` 必须返回表示属性是否存在的布尔值，返回非布尔值会转为布尔值。会拦截 `property in proxy`、`property in Object.create(proxy)`、`with(proxy) {(property);}` 和 `Reflect.has(proxy, property)` 操作。

如果：

- `target.property` <mark>存在且不可配置</mark>，处理程序必须返回 `true`

- `target.property` <mark>存在且目标对象不可扩展</mark>，处理程序必须返回 `true`


## defineProperty()

在 `Object.defineProperty()` 中会调用 `defineProperty()` 捕获器，对应反射 `API` 方法 `Reflect.defineProperty()`

```javascript
const myTarget = {};

const proxy = new Proxy(myTarget, {
	/*
		target: 目标对象
		property: 引用的目标对象上的字符串键属性
		descriptor: 包含可选的 enumerable、configurable、writable、value、get 和 set 定义的对象
	*/
    defineProperty(target, property, descriptor) {
        console.log('defineProperty()');

        return Reflect.defineProperty(...arguments);
    }
});

// defineProperty()
Object.defineProperty(proxy, 'foo', { value: 'bar' });
```

`defineProperty()` 必须返回表示属性是否存在的布尔值，返回非布尔值会转为布尔值。会拦截 `Object.defineProperty(proxy, property, descriptor)` 和 `Reflect.defineProperty(proxy, property, descriptor)` 操作。

如果：

- 目标对象<mark>不可扩展</mark>，无法定义属性

- 目标对象有一个<mark>可配置的属性</mark>，不能添加同名的不可配置属性

- 目标对象有一个<mark>不可配置的属性</mark>，不能添加同名的可配置属性


## getOwnPropertyDescriptor()

在 `Object.getOwnPropertyDescriptor()` 中会调用 `getOwnPropertyDescriptor()` 捕获器，对应反射 `API` 方法 `Reflect.getOwnPropertyDescriptor()`

```javascript
const myTarget = {};

const proxy = new Proxy(myTarget, {
	/*
		target: 目标对象
		property: 引用的目标对象上的字符串键属性
	*/
    getOwnPropertyDescriptor(target, property) {
        console.log('getOwnPropertyDescriptor()');

        return Reflect.getOwnPropertyDescriptor(...arguments);
    }
});

// getOwnPropertyDescriptor()
Object.getOwnPropertyDescriptor(proxy, 'foo');
```

`getOwnPropertyDescriptor()` <mark>必须返回对象</mark>，在属性不存在时返回 `undefined`。会拦截 `Object.getOwnPropertyDescriptor(proxy, property)` 和 `Reflect.getOwnPropertyDescriptor(proxy, property)` 操作。

如果：

- `target.property` <mark>存在且不可配置</mark>，必须返回一个表示该属性存在的对象

- `target.property` <mark>存在且可配置</mark>，必须返回表示该属性可配置的对象

- `target.property` <mark>存在且 `target` 不可扩展</mark>，必须返回一个表示该属性存在的对象

- `target.property` <mark>不存在且 `target` 不可扩展</mark>，必须返回 `undefined` 表示该属性不存在

- `target.property` <mark>不存在</mark>，不能返回表示该属性可配置的对象


## deleteProperty()

在 `delete` 操作符中会调用 `deleteProperty()` 捕获器，对应反射 `API` 方法 `Reflect.deleteProperty()`

```javascript
const myTarget = {};

const proxy = new Proxy(myTarget, {
	/*
		target: 目标对象
		property: 引用的目标对象上的字符串键属性
	*/
    deleteProperty(target, property) {
        console.log('deleteProperty()');

        return Reflect.deleteProperty(...arguments);
    }
});

// deleteProperty()
delete proxy.foo;
```

`deleteProperty()` 必须返回表示属性是否存在的布尔值，返回非布尔值会转为布尔值。会拦截 `delete proxy.property`、`delete proxy[property]` 和 `Reflect.deleteProperty(proxy, property)` 操作。

- 如果 `target.property` <mark>存在且不可配置</mark>，不能删除这个属性


## ownKeys()

在 `Object.keys()` 及类似方法中会调用 `ownKeys()` 捕获器，对应反射 `API` 方法 `Reflect.ownKeys()`

```javascript
const myTarget = {};

const proxy = new Proxy(myTarget, {
	/*
		target: 目标对象
	*/
    ownKeys(target) {
        console.log('ownKeys()');

        return Reflect.ownKeys(...arguments);
    }
});

// ownKeys()
Object.keys(proxy);
```

`ownKeys()` 必须返回包含字符串或符号的可枚举对象。会拦截 `Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)` 和 `Reflect.ownKeys(proxy)` 操作。

- 必须返回包含 `target` 所有不可配置的自有属性的可枚举对象

- 如果 `target` 不可扩展，返回可枚举对象必须准确包含自有属性键


## getPrototypeOf()

在 `Object.getPrototypeOf()` 中会调用 `getPrototypeOf()` 捕获器，对应反射 `API` 方法 `Reflect.getPrototypeOf()`

```javascript
const myTarget = {};

const proxy = new Proxy(myTarget, {
	/*
		target: 目标对象
	*/
    getPrototypeOf(target) {
        console.log('getPrototypeOf()');

        return Reflect.getPrototypeOf(...arguments);
    }
});

// getPrototypeOf()
Object.getPrototypeOf(proxy);
```

`getPrototypeOf()` 必须返回对象或 `null`。会拦截 `Object.getPrototypeOf(proxy)`、`Reflect.getPrototypeOf(proxy)`、`proxy.__proto__`、`Object.prototype.isPrototypeOf(proxy)` 和 `proxy instanceof Object` 操作。

- 如果 `target` 不可扩展，`Object.getPrototypeOf(proxy)` 唯一有效的返回值就是 `Object.getPrototypeOf(target)` 的返回值


## setPrototypeOf()

在 `Object.setPrototypeOf()` 中会调用 `setPrototypeOf()` 捕获器，对应反射 `API` 方法 `Reflect.setPrototypeOf()`

```javascript
const myTarget = {};

const proxy = new Proxy(myTarget, {
	/*
		target: 目标对象
		prototype: target 的替代原型，如果是顶级原型则为 null
	*/
    setPrototypeOf(target, prototype) {
        console.log('setPrototypeOf()');

        return Reflect.setPrototypeOf(...arguments);
    }
});

// setPrototypeOf()
Object.setPrototypeOf(proxy, Object);
```

`getPrototypeOf()` 必须返回表示原型赋值是否成功的布尔值，返回非布尔值会转为布尔值。会拦截 `Object.setPrototypeOf(proxy)` 和 `Reflect.setPrototypeOf(proxy)` 操作。

- 如果 `target` 不可扩展，`Object.setPrototypeOf()` 唯一有效的 `prototype` 参数就是 `Object.getPrototypeOf(target)` 的返回值


## isExtensible()

在 `Object.isExtensible()` 中会调用 `isExtensible()` 捕获器，对应反射 `API` 方法 `Reflect.isExtensible()`

```javascript
const myTarget = {};

const proxy = new Proxy(myTarget, {
	/*
		target: 目标对象
	*/
    isExtensible(target) {
        console.log('isExtensible()');

        return Reflect.isExtensible(...arguments);
    }
});

// isExtensible()
Object.isExtensible(proxy);
```

`getPrototypeOf()` 必须返回表示 `target` 是否可扩展的布尔值，返回非布尔值会转为布尔值。会拦截 `Object.isExtensible(proxy)` 和 `Reflect.isExtensible(proxy)` 操作。

如果：

- `target` 可扩展，必须返回 `true`

- `target` 不可扩展，必须返回 `false`


## preventExtensions()

在 `Object.preventExtensions()` 中会调用 `preventExtensions()` 捕获器，对应反射 `API` 方法 `Reflect.preventExtensions()`

```javascript
const myTarget = {};

const proxy = new Proxy(myTarget, {
	/*
		target: 目标对象
	*/
    preventExtensions(target) {
        console.log('preventExtensions()');

        return Reflect.preventExtensions(...arguments);
    }
});

// preventExtensions()
Object.preventExtensions(proxy);
```

`preventExtensions()` 必须返回表示 `target` 是否已不可扩展的布尔值，返回非布尔值会转为布尔值。会拦截 `Object.preventExtensions(proxy)` 和 `Reflect.preventExtensions(proxy)` 操作。

- 如果 `Object.isExtensible(proxy)` 是 `false`，必须返回 `true`


## apply()

在调用函数时会调用 `apply()` 捕获器，对应反射 `API` 方法 `Reflect.apply()`

```javascript
const myTarget = () => {};

const proxy = new Proxy(myTarget, {
	/*
		target: 目标对象
		thisArg: 调用函数时的 this 参数
		argumentsList: 调用函数时的参数列表
	*/
    apply(target, thisArg, ...argumentsList) {
        console.log('apply()');

        return Reflect.apply(...arguments);
    }
});

// apply()
proxy();
```

`apply()` 返回值无限制。会拦截 `proxy(...argumentsList)`、`Function.prototype.apply(thisArg, argumentsList)`、`Function.prototype.call(thisArg, ...argumentsList)` 和 `Reflect.apply(target, thisArgument, argumentsList)` 操作。

- `target` 必须是一个函数对象


## construt()

在 `new` 操作符中会调用 `construt()` 捕获器，对应反射 `API` 方法 `Reflect.construt()`

```javascript
const myTarget = function() {};

const proxy = new Proxy(myTarget, {
	/*
		target: 目标构造函数
		argumentsList: 传给目标构造函数的参数列表
		newTarget: 最初被调用的构造函数
	*/
    construct(target, argumentsList, newTarget) {
        console.log('construct()');

        return Reflect.construct(...arguments);
    }
});

// construct()
new proxy;
```

`construct()` 必须返回一个对象。会拦截 `new proxy(...argumentsList)` 和 `Reflect.construct(target, argumentsList, newTarget)` 操作。

- `target` 必须可用作构造函数
