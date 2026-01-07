---
title: JavaScript 笔记-代理基础
date: 2025-10-29 16:34:58
tags:
	- JavaScript
	- 笔记
categories: JavaScript笔记
---

<mark>代理是目标对象的抽象。</mark>目标对象既可以直接被操作，也可以通过代理来操作。但直接操作会绕过代理。

使用 `Proxy` 构造函数创建代理，该函数接收**目标对象**和**处理程序对象**作为参数。


## 创建空代理

空代理除了作为一个抽象的目标对象，什么也不做。在任何可以使用目标对象的地方，都可以通过同样的方式来使用与之关联的代理对象。

可以向 `Proxy` 构造函数传递一个简单的对象字面量作为处理程序对象，来创建空代理。

```javascript
const target = {
    id: 'target'
};

const handler = {};

// 使用 Proxy 构造函数创建代理
const proxy = new Proxy(target, handler);

// id 属性会访问同一个值
console.log(target.id);  // target
console.log(proxy.id);  // target

// 给目标属性赋值会反映在两个对象上
target.id = 'foo';
console.log(target.id);  // foo
console.log(proxy.id);  // foo

// 在代理对象上执行的任何操作都会应用到目标对象
proxy.id = 'bar';
console.log(target.id);  // bar
console.log(proxy.id);  // bar

console.log(target.hasOwnProperty('id'));  // true
console.log(proxy.hasOwnProperty('id'));  // true

// Proxy.prototype 是 undefined，不能使用 instanceof 操作符
// TypeError: Function has non-object prototype 'undefined' in instanceof check
console.log(target instanceof Proxy);
// TypeError: Function has non-object prototype 'undefined' in instanceof check
console.log(proxy instanceof Proxy);

// 使用严格相等区分代理和目标
console.log(target === proxy);  // false
```


## 定义捕获器

- 使用代理的主要目的是定义**捕获器（trap）**

- 捕获器是在处理程序对象中定义的“基本操作的拦截器”

- 每个处理程序对象可以包含**零个或多个捕获器**，每个捕获器都对应一种基本操作，代理对象可以**直接或间接调用**

- 代理可以在基本操作传播到目标对象之前先调用捕获器函数，<mark>拦截并修改相应的行为</mark>

> 捕获器在操作系统中是程序流的一个同步中断，可以暂停程序流，转而执行一段子例程，再返回原始程序流

```javascript
const target = {
    foo: 'bar'
};

// 定义一个 get() 捕获器
// 在 ECMAScript 以某种形式调用 get() 时触发
const handler = {
	// 捕获器在处理程序对象中以方法名为键
    get() {
        return 'handler override';
    }
};

const proxy = new Proxy(target, handler);

console.log(target.foo);  // bar
/* 
    只有通过 代理对象 执行 get() 操作时
    才会触发定义的 get() 捕获器
    
    只有在 代理对象 上执行
    proxy[property]、proxy.property 或 Object.create(proxy)[property]
    等操作才会触发基本的 get() 操作以获取属性
*/
console.log(proxy.foo);  // handler override

console.log(target['foo']);  // bar 
console.log(proxy['foo']);  // handler override

console.log(Object.create(target)['foo']);  // bar
console.log(Object.create(proxy)['foo']);  // handler override
```


## 捕获器参数和反射 API

所有捕获器都可以访问相应的参数，`get()` 捕获器能接收到<mark>目标对象、要查询的属性和代理对象。</mark>

```javascript
const target = {
    foo: 'bar'
};

const handler = {
    /*
    // 目标对象、要查询的属性和代理对象
    get(trapTarget, property, receiver) {
        console.log(trapTarget === target);
        console.log(property);
        console.log(receiver === proxy);
    }
    */

    // 重写被捕获方法
    get(trapTarget, property, receiver) {
        return trapTarget[property];
    }
};

const proxy = new Proxy(target, handler);

/*
    true
    foo
    true
*/
// proxy.foo;

console.log(proxy.foo);  // bar
console.log(target.foo);  // bar
```

- 可以通过调用全局 `Reflect` 对象（封装了原始行为）的同名方法来重写函数。`Reflect` 是一个内置的对象，它提供了一组静态方法，用于执行各种与对象操作相关的通用功能，动态地检查或修改对象的结构和行为。

- 处理程序对象中所有可捕获的方法都有与捕获器拦截的方法相同的名称和函数签名，而且有和被拦截方法相同行为的相应的反射（`Reflect`）`API` 方法。

```javascript
const target = {
    foo: 'bar'
};

// 使用反射 API 定义空代理对象
const handler = {
    /*
    get() {
        return Reflect.get(...arguments);
    }
    */

    get: Reflect.get
};

const proxy = new Proxy(target, handler);

console.log(proxy.foo);  // bar
console.log(target.foo);  // bar
```

不需要定义处理程序对象就可以创建一个可以捕获所有方法，并将每个方法转发给对应反射 `API` 的空代理

```javascript
const target = {
    foo: 'bar'
};

const proxy = new Proxy(target, Reflect);

console.log(proxy.foo);  // bar
console.log(target.foo);  // bar
```

可以在反射 `API` 样板代码的基础上用最少的代码修改捕获的方法

```javascript
const target = {
    foo: 'bar',
    baz: 'qux'
};

const handler = {
    get(trapTarget, property, receiver) {
        let decoration = '';

        if(property === 'foo') {
            decoration = '!!!';
        }

        return Reflect.get(...arguments) + decoration;
    }
}

const proxy = new Proxy(target, Reflect);

// 只有通过代理执行时才会触发捕获器
console.log(proxy.foo);  // bar!!!
console.log(target.foo);  // bar

console.log(proxy.baz);  // qux
console.log(target.baz);  // qux
```


## 捕获器的限制

每个捕获的方法都知道<mark>目标对象上下文、捕获函数签名</mark>，捕获处理程序的行为<mark>必须遵循</mark>“**捕获器不变式**”（trap invariant）。

如果目标对象有一个不可配置且不可写的数据属性，捕获器返回一个与该属性不同的值，会抛出 `TypeError`。

```javascript
const target = {};

Object.defineProperty(target, 'foo', {
    configurable: false,
    writable: false,
    value: 'bar'
});

const handler = {
    get() {
        return 'qux';
    }
};

const proxy = new Proxy(target, handler);

/*
    TypeError: 'get' on proxy: property 'foo' is a read-only and non-configurable
    data property on the proxy target but the proxy did not return its actual
    value (expected 'bar' but got 'qux')
 */
console.log(proxy.foo);
```


## 撤销代理

`Proxy` 的 `revocable()` 方法支持撤销代理对象与目标对象的关联，且操作不可逆。撤销代理后再调用代理会抛出 `TypeError`。

```javascript
const target = {
    foo: 'bar'
};

const handler = {
    get() {
        return 'intercepted';
    }
};

// 在实例化时同时生成代理对象和撤销函数
const { proxy, revoke } = Proxy.revocable(target, handler);

console.log(proxy.foo);  // intercepted
console.log(target.foo);  // bar

// 撤销代理
revoke();

// TypeError: Cannot perform 'get' on a proxy that has been revoked
console.log(proxy.foo);
```


## 反射 API

以下是优先使用反射 `API` 的情况

### 反射 API 与对象 API

`Object` 的方法适用于通用程序，反射方法适用于细粒度的对象控制与操作

- 反射 `API` 并不限于捕获处理程序

- 大多数反射 `API` 方法在 `Object` 类型上有对应的方法


### 状态标记

反射方法返回称作“**状态标记**”的布尔值，表示执行的操作是否成功

```javascript
const o = {};

try {
    Object.defineProperty(o, 'foo', 'bar');
    console.log('success');
} catch(e) {
    console.log('failure');
}

// 使用 Reflect.defineProperty() 重构上面的代码
const o = {};

// 属性定义错误时，Reflect.defineProperty() 返回 false
if(Reflect.defineProperty(o, 'foo', {value: 'bar'})) {
    console.log('success');
} else {
    console.log('failure');
}
```

`Reflect.defineProperty()`、`Reflect.preventExtensions()`、`Reflect.setPrototypeOf()`、`Reflect.set()` 和 `Reflect.deleteProperty()` 都会提供状态标记


### 替代操作符

`Reflect.get()`（可以替代对象属性访问操作符）、`Reflect.set()`（可以替代 `=` 赋值操作符）、`Reflect.has()`（可以替代 `in` 操作符或 `with()`）、`Reflect.deleteProperty()`（可以替代 `delete` 操作符）和 `Reflect.construct()`（可以替代 `new` 操作符）等反射方法**提供只有通过操作符才能完成的操作**


### 安全地使用函数

为了绕过使用 `apply` 方法调用函数时，被调函数也定义了 `apply` 属性的情况（直接使用 `对象.apply(...)` 调用函数时，会优先访问函数自身的 `apply` 属性），可使用定义在 `Function` 原型上的 `apply` 方法（强制使用 `JavaScript` 引擎内置的函数调用逻辑，无论被调函数是否有 `apply` 属性，都能保证正确执行目标函数）

```javascript
Function.prototype.apply.call(myFunc, thisVal, argumentList);

// 避免被调函数也定义了 apply 属性
Reflect.apply(myFunc, thisVal, argumentList);
```


## 代理另一个代理

可以通过一个代理去代理另一个代理，在一个目标对象上构建多层拦截网

```javascript
const target = {
    foo: 'bar'
};

const firstProxy = new Proxy(target, {
    get() {
        console.log('first proxy');

        return Reflect.get(...arguments);
    }
});

const secondProxy = new Proxy(firstProxy, {
    get() {
        console.log('second proxy');

        return Reflect.get(...arguments);
    }
});

/*
second proxy
first proxy
bar
*/
console.log(secondProxy.foo);
```


## 代理的问题

代理作为对象的虚拟层可以正常使用，但某些情况下不能与现有的机制协同


### 潜在问题来源 —— this 值

如果代理的目标对象依赖于**对象标识**（判断两个对象是否是同一个实例的机制，两个变量是否指向内存中的同一个对象），可能会碰到问题。

```javascript
const target = {
    thisValEqualsProxy() {
        // 方法中的 this 通常指向调用这个方法的对象
        return this === proxy;
    }
};

// 空代理
const proxy = new Proxy(target, {});

console.log(target.thisValEqualsProxy());  // false
console.log(proxy.thisValEqualsProxy());  // true


const wm = new WeakMap();

// 依赖 User 实例的对象标识
class User {
    constructor(userId) {
        // WeakMap 的键只能是对象，键的唯一性完全依赖对象标识
        wm.set(this, userId);
    }

    set id(userId) {
        wm.set(this, userId);
    }

    get id() {
        return wm.get(this);
    }
}

const user = new User(123);
console.log(user.id);  // 123

// 代理对象尝试从自身获取该实例
// 代理对象 userInstanceProxy 从未作为键存入 WeakMap
// const userInstanceProxy = new Proxy(user, {});
// console.log(userInstanceProxy.id);  // undefined

// 代理 User 类本身
const UserClassProxy = new Proxy(User, {});
// 以代理实例作为 WeakMap 的键
const proxyUser = new UserClassProxy(456);
console.log(proxyUser.id);  // 456
```


### 代理与内部槽位

有些 `ECMAScript` 内置类型可能会依赖代理无法控制的机制，导致在代理上调用某些方法出错。

比如，`Date` 类型方法的执行依赖 `this` 值的内部槽位 `[[NumberDate]]`，但代理对象不存在该内部槽位，代理拦截后会抛出 `TypeError`。

```javascript
const target = new Date();
const proxy = new Proxy(target, {});

console.log(proxy instanceof Date);  // true

proxy.getDate();  // TypeError: this is not a Date object
```

> 内部槽位是 `ECMA` 规范定义的、对象内部用于存储状态或特性的特殊“容器”，不是对象的属性，无法直接访问或修改。内部槽位仅在引擎层面存在，用于实现语言的核心功能
