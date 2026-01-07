---
title: JavaScript笔记-类
date: 2025-10-26 11:41:15
tags:
	- JavaScript
	- 笔记
categories: JavaScript笔记
---

`ECMAScript 6` 引入的 `class` 关键字具有正式定义类的能力，但<mark>实际上使用的仍然是原型和构造函数的概念</mark>


## 类定义

有两种主要方式定义类：类声明和类表达式

```javascript
// 类声明
class Person {}

// 类表达式
const Animal = class {};
```

- 函数表达式和类表达式在求值前都不能引用

- 类定义不能提升，但函数定义可以

- 函数受**函数作用域**限制，类受**块作用域**限制

```javascript
{
    function FunctionDeclaration() {}
    class ClassDeclaration {}
}

// [Function: FunctionDeclaration]
console.log(FunctionDeclaration);
// ReferenceError: ClassDeclaration is not defined
console.log(ClassDeclaration);
```

- 类可以包含构造函数方法、实例方法、获取函数、设置函数和静态类方法，但<mark>都不是必须的</mark>

- 空的类定义同样有效

- 默认情况下，类定义中的代码都在严格模式下执行

- <mark>类名的首字母大写</mark>，以区别于通过它创建的实例

- <mark>类表达式的名称是可选的</mark>。把类表达式赋值给变量后，可以<mark>通过 `name` 属性取得类表达式的名称字符串</mark>，但<mark>不能在类表达式作用域外访问该标识符</mark>

```javascript
let Person = class PersonName {
    identify() {
        console.log(Person.name, PersonName.name);
    }
}

let p = new Person();

p.identify();  // PersonName PersonName

console.log(Person.name);  // PersonName
console.log(PersonName);  // ReferenceError: PersonName is not defined
```


## 类构造函数

- `constructor` 关键字用于在类定义块内部创建类的构造函数

- `constructor` 会告诉解释器在使用 `new` 操作符创建类的新实例时，调用该函数

- 不定义构造函数相当于将构造函数定义为**空函数**


### 实例化

使用 `new` 调用类的构造函数会执行[创建对象](../../22/JavaScript-笔记-创建对象/#构造函数)的过程

类实例化时传入的参数会用作构造函数的参数

默认情况下，类构造函数会在执行后返回 `this` 对象，被用作实例化的对象

如果返回的不是 `this` 对象，而是其他对象，对这个对象使用 `instanceof` 操作符返回结果为 `false`

```javascript
class Person {
    constructor(override) {
        this.foo = 'foo';

        if(override) {
            // 返回的不是 this 对象
            return {
                bar: 'bar'
            };
        }
    }
}

let p1 = new Person(),
    // 未返回 this 对象，p2 的原型指针没有被修改
    p2 = new Person(true);

console.log(p1);  // Person { foo: 'foo' }
console.log(p1 instanceof Person);  // true
console.log(typeof p1);  // object

console.log(p2);  // { bar: 'bar' }
// 无法通过 instanceof 操作符检测出跟类有关联
console.log(p2 instanceof Person);  // false
console.log(typeof p2);  // object
```

调用类构造函数必须使用 `new` 操作符，不使用 `new` 会抛出错误

普通构造函数如果不使用 `new` 调用，就会以全局的 `this`（通常是 `window`）作为内部对象

实例化后，类构造函数会成为普通的实例方法（仍需使用 `new` 调用），可以在实例上引用它

```javascript
class Person {}

let p1 = new Person();

// TypeError: Class constructor Person cannot be invoked without 'new'
// p1.constructor();

// 使用类构造函数的引用创建一个新实例
let p2 = new p1.constructor();
```


### 把类当成特殊函数

`ECMAScript` 类是一种特殊的函数

```javascript
class Person {}

console.log(Person);  // [class Person]
console.log(typeof Person);  // function

console.log(Person.prototype);  // {}
// 类标识符的 prototype 属性有一个 constructor 属性指向类自身
console.log(Person === Person.prototype.constructor);  // true
```

类中定义的 `constructor` 方法**不会**被当成构造函数，对它使用 `instanceof` 操作符返回 `false`。如果在创建实例时直接<mark>将类构造函数当成普通构造函数</mark>，`instanceof` 操作符的返回值会**反转**

```javascript
let p1 = new Person();

console.log(p1.constructor === Person);  // true
console.log(p1 instanceof Person);  // true
console.log(p1 instanceof Person.constructor);  // false

// 直接将类构造函数当成普通构造函数使用
let p2 = new Person.constructor();

console.log(p2.constructor === Person);  // false
console.log(p2 instanceof Person);  // false
console.log(p2 instanceof Person.constructor);  // true
```

类可以像其他对象或函数引用一样作为参数传递

```javascript
// 类可以像函数一样在任何地方定义，比如数组中
let classList = [
    class {
        constructor(id) {
            this.id_ = id;
            console.log(`instance ${this.id_}`);
        }
    }
];

function createInstance(classDefinition, id) {
    return new classDefinition(id);
}

// classList[0] 是作为参数传递的类
let foo = createInstance(classList[0], 3141);  // instance 3141
```

类可以像立即调用函数表达式一样立即实例化

```javascript
// 类表达式的类名是可选的
// let p = new class Foo {
let p = new class {
    constructor(x) {
        console.log(x);
    }
}('bar');  // bar

console.log(p);  // Foo {}
```


## 实例、原型和类成员

### 实例

在构造函数内部，可以为新创建的实例（`this`）添加“自有”属性。构造函数执行完也可以给实例继续添加新成员

<mark>每个实例都对应一个唯一的成员对象，所有成员都不会在原型上共享</mark>

```javascript
class Person {
    constructor() {
        // 为新创建的实例(this)添加"自有"属性
        this.name = new String('Jack');
        /*
            箭头函数，调用时会打印 this.name
            箭头函数没有自己的 this，它的 this 继承自定义时所在的上下文（即构造函数执行时的 this）
            箭头函数的 this 始终绑定创建时的实例，而普通函数的 this 会随调用方式变化
        */
        this.sayName = () => console.log(this.name);
        this.nicknames = ['Jake', 'J-Dog']
    }
}

// 每个实例都对应一个唯一的成员对象，所有成员都不会在原型上共享
let p1 = new Person(),
    p2 = new Person();

p1.sayName();  // [String: 'Jack']
p2.sayName();  // [String: 'Jack']

console.log(p1.name === p2.name);  // false
console.log(p1.sayName === p2.sayName);  // false
console.log(p1.nicknames === p2.nicknames);  // false

p1.name = p1.nicknames[0];
p2.name = p2.nicknames[1];

p1.sayName();  // Jake
p2.sayName();  // J-Dog
```


### 原型方法与访问器

- 类体内直接声明的方法会自动绑定到原型对象上，无需手动操作 prototype

- 可以把**方法**定义在类构造函数或类块中，不能在类块中给原型添加**原始值或对象**作为成员数据

- 可以使用字符串、符号或计算的值作为类方法的键

- 类定义支持获取和设置访问器

```javascript
const symbolKey = Symbol('symbolKey');

class Person {
	// 不能在类块中给原型添加原始值或对象作为成员数据
	// name: 'Jake'  // SyntaxError: Unexpected identifier 'name'

    constructor() {
        // 添加到 this 的所有内容会存在于不同的实例
        this.locate = () => console.log('instance');
    }

    // 在类块中定义的所有内容都会定义在类的原型上
    locate() {
        console.log('prototype');
    }

    stringKey() {
        console.log('invoked stringKey');
    }

    // 使用符号作为键
    [symbolKey]() {
        console.log('invoked symbolKey');
    }

    // 使用计算的值作为键
    ['computed' + 'Key']() {
        console.log('invoked computedKey');
    }

    // 设置访问器
    set name(newName) {
    	this.name_ = newName;
    }

    // 获取访问器
    get name() {
    	return this.name_;
    }
}

let p = new Person();

p.locate();  // instance
Person.prototype.locate();  // prototype

p.stringKey();  // invoked stringKey
p[symbolKey]();  // invoked symbolKey
p.computedKey();  // invoked computedKey

p.name = 'Jake';
console.log(p.name);  // Jake
```


### 静态类方法

静态方法通常用于执行不特定于实例的操作，也不要求存在类的实例，**每个类只能有一个静态成员**（类级别的属性）

静态类成员在类定义中使用 `static` 关键字作为前缀，使用 `this` 引用类自身

```javascript
class Person {
    constructor() {
        // 添加到 this 的所有内容都会存在于不同的实例上
        this.locate = () => console.log('instance', this);
    }

    // 定义在类的原型对象上
    locate() {
        console.log('prototype', this);
    }

    // 定义在类本身上
    static locate() {
        console.log('class', this);
    }
}

let p = new Person();

p.locate();  // instance Person { locate: [Function (anonymous)] }
Person.prototype.locate();  // prototype {}
Person.locate();  // class [class Person]
```

静态类方法适合作为实例工厂

```javascript
class Person {
    constructor(age) {
        this.age_ = age;
    }

    // sayAge() 没有 return 语句，默认返回 undefined
    // 类实例调用 sayAge() 时会先打印年龄，再打印返回的年龄值
    sayAge() {
        console.log(this.age_);
    }

    // 定义在类本身上
    static create() {
        // 使用随机年龄创建并返回一个 Person 实例
        return new Person(Math.floor(Math.random()*100));
    }
}

// Person { age_: 83 }
console.log(Person.create());

let p1 = new Person(29);
/*
    29
    undefined
*/
console.log(p1.sayAge());
```


### 非函数原型和类成员

`ECMAScript 2022` 允许直接在类体中定义数据成员，无需在 `constructor` 中定义

在类定义外部，可以在原型或类上手动添加成员数据

```javascript
class Person {
    // ES2022 允许直接在类体中定义数据成员，无需在 constructor 中定义
    age = 0;

    constructor(name) {
        // 在构造函数中通过 this 定义数据成员
        this.name = name;
        // this.age = age;
    }

    sayJob() {
        console.log(`${Person.greeting} ${this.job}`);
    }
}

const p = new Person("Alice");
console.log(p.name);  // Alice
console.log(p.age);  // 0

// 在类定义外部手动添加成员数据
// 在类上定义数据成员
Person.greeting = 'My job is';
// 在原型上定义数据成员
Person.prototype.job = 'Software Engineer';

let p1 = new Person('Jake');
p1.sayJob();  // My job is Software Engineer
```


### 迭代器与生成器方法

类定义语法支持在原型和类本身上定义生成器方法

```javascript
class Person {
    constructor() {
        this.nicknames = ['cJack', 'cJake', 'cJ-Dog'];
    }

    
    /*
    添加一个默认的迭代器，把类实例变成可迭代对象
    
    方法名前的 * 表示这是一个 生成器函数

    [Symbol.iterator] 是一个特殊的 内置 Symbol 属性，当一个对象定义了该方法时，就表示它是 “可迭代的”

    yield* 是 Generator 函数中的语法，用于 “委托” 另一个可迭代对象的迭代过程。它会自动遍历被委托的对象，并逐个返回其迭代结果

    *[Symbol.iterator]() {
        yield *this.nicknames.entries();
    }

    entries() 方法会返回一个数组迭代器对象，用于遍历其 “键值对”
    */

    // 只返回迭代器实例效果与返回可迭代对象相同
    [Symbol.iterator]() {
        return this.nicknames.entries();
    }

    // 在原型上定义生成器方法
    *creatNicknameIterator() {
        yield 'Jack';
        yield 'Jake';
        yield 'J-Dog';
    }

    // 在类上定义生成器方法
    static *createJobIterator() {
        yield 'Butcher';
        yield 'Baker';
        yield 'Candlestick maker';
    }
}

let jobIter = Person.createJobIterator();
console.log(jobIter.next().value);  // Butcher
console.log(jobIter.next().value);  // Baker
console.log(jobIter.next().value);  // Candlestick maker

let p = new Person();
let nicknameIter = p.creatNicknameIterator();
console.log(nicknameIter.next().value);  // Jack
console.log(nicknameIter.next().value);  // Jake
console.log(nicknameIter.next().value);  // J-Dog

for(let [idx, nickname] of p) {
    /*
        cJack
        cJake
        cJ-Dog

    */
    console.log(nickname);
}
```


## 继承

`ECMAScript 6` 原生支持类继承机制，但<mark>背后依旧使用原型链</mark>


### 继承基础

`ES6` 支持**单继承**。使用 `extends` 关键字，可以继承任何拥有 **`[[Construct]]`** 和**原型**的对象。不仅可以继承一个类，也可以继承普通的构造函数（保持向后兼容）

```javascript
class Vehicle {
    identifyPrototype(id) {
        console.log(id, this);
    }

    static identifyClass(id) {
        console.log(id, this);
    }
}

// 继承类
class Bus extends Vehicle {}

let b = new Bus();
console.log(b instanceof Bus);  // true
console.log(b instanceof Vehicle);  // true

let v = new Vehicle();

// 派生类通过原型链访问类和原型上定义的方法
b.identifyPrototype('bus');  // bus, Bus {}
v.identifyPrototype('vehicle');  // vehicle, Vehicle {}

Bus.identifyClass('bus');  // bus [class Bus extends Vehicle]
Vehicle.identifyClass('vehicle');  // vehicle [class Vehicle]

function Person() {}

class Engineer extends Person {}

let e = new Engineer();
console.log(e instanceof Engineer);  // true
console.log(e instanceof Person);  // true

// extends 也可以在类表达式中使用
let Bar = class extends Foo {}
```


### 构造函数、HomeObject 和 super()

可以使用 `super` 关键字引用派生类方法的原型

- `super` 关键字只能在派生类中使用

- 仅限类构造函数、实例方法和静态方法内部使用

```javascript
class Vehicle {
    constructor() {
        this.hasEngine = true;
    }

    static identify() {
        console.log('vehicle');
    }
}

class Bus extends Vehicle {
    constructor() {
        // 在调用 super() 之前引用 this 会报错
        // ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
        super();  // 相当于 super.constructor()

        console.log(this instanceof Vehicle);  // true
        // 派生类的方法
        console.log(this);  // Bus { hasEngine: true }
    }

    static identify() {
        // 静态方法中可以通过 super 调用父类的静态方法
        super.identify();
    }
}

/*
    true
    Bus { hasEngine: true }
*/
new Bus();
Bus.identify();  // vehicle
```

- `ES6` 给类构造函数和静态方法添加了内部指针 `[[HomeObject]]`（无法直接查看），指向定义该方法的对象。

- 该指针自动赋值，`[[HomeObject]]` 的原型始终定义为 `super`
<br>

使用 `super` 注意事项：

```javascript
class Vehicle {
    constructor(licensePlate) {
        // super 只能在 派生类 构造函数和静态方法中使用
        // super();  // SyntaxError: 'super' keyword unexpected here

        this.licensePlate = licensePlate;
    }
}

class Bus extends Vehicle {
    constructor(licensePlate) {
        // 不能单独引用 super 关键字
        // 要么调用构造函数，要么引用静态方法
        // console.log(super);  // SyntaxError: 'super' keyword unexpected here

        // 需要手动给父类构造函数传参
        super(licensePlate);
    }
}

class Bus1 extends Vehicle {
    constructor() {
        // super() 会调用父类构造函数，并将返回的实例赋值给 this
        super();

        console.log(this instanceof Vehicle);
    }
}

class Van extends Vehicle {
    // 在派生类中显式定义构造函数，必须在其中调用 super() 或返回一个对象
    constructor() {
        // super();
        return {};
    }
}

// 未定义类构造函数，实例化派生类时会调用父类构造函数，并传入所有传给派生类的参数
class Bus2 extends Vehicle {}

new Bus1();  // true

console.log(new Bus('1337H4X'));  // Bus { licensePlate: '1337H4X' }

console.log(new Bus2('1337H4X'));  // Bus2 { licensePlate: '1337H4X' 

console.log(new Van());  // {}
```


### 抽象基类

通过在实例化时检测 `new.target`（`new.target` 保存通过 `new` 关键字调用的类或函数） 是不是抽象基类，可以阻止对抽象基类的实例化

```javascript
// 抽象基类
class Vehicle {
    constructor() {
        console.log(new.target);

        if(new.target === Vehicle) {
            throw new Error('Vehicle cannot be directly instantiated');
        }

        if(!this.foo) {
            throw new Error('Inheriting class must define foo()');
        }

        console.log('success!');
    }
}

// 派生类
class Bus extends Vehicle {
    foo() {}
}

// 派生类
class Van extends Vehicle {}

// [class Bus extends Vehicle]
// success!
new Bus();
// [class Vehicle]
// Error: Vehicle cannot be directly instantiated
new Vehicle();
```


### 继承内置类型

可以扩展内置类型，覆盖 `Symbol.species` 访问器（决定在创建返回实例时使用的类）

```javascript
class SuperArray extends Array {
    shuffle() {
        for (let i = this.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this[i], this[j]] = [this[j], this[i]];
        }
    }

    // 默认返回 SuperArray 类实例
    // 返回 Array 类实例
    static get [Symbol.species]() {
        return Array;
    }
}

let a = new SuperArray(1, 2, 3, 4, 5);

console.log(a instanceof Array);  // true
console.log(a instanceof SuperArray);  // true

console.log(a);  // SuperArray(5) [ 1, 2, 3, 4, 5 ]
a.shuffle();
console.log(a);  // SuperArray(5) [ 1, 5, 3, 2, 4 ]

let a1 = new SuperArray(1, 2, 3, 4, 5);
/*
    内置类型的方法会返回新实例
    
    filter 用于根据条件筛选元素，返回一个新数组
    !! 是双重非运算符，用于将数值转为布尔类型
    第一个 ! 将数值转换为布尔值的反值
    第二个 ! 对第一步的结果取反，得到原 value 对应的真实布尔值
    条件等价于 "x 是奇数"
*/
let a2 = a1.filter(x => !!(x%2))

console.log(a1);  // SuperArray(5) [ 1, 2, 3, 4, 5 ]
console.log(a2);  // [ 1, 3, 5 ]

console.log(a1 instanceof SuperArray);  // true
console.log(a2 instanceof SuperArray);  // false
```


### 多类继承

`ES6` 没有显式支持多类继承，但通过现有特性可**模拟多类继承**

定义一组“可嵌套”的函数，每个函数分别接收一个超类（被其他类继承的 “父类”）作为参数，将**混入类**定义为该参数的子类，并返回这个类。可以<mark>连续调用组合函数，组成超类表达式</mark>

```javascript
class Vehicle {}

let FooMixin = (Superclass) => class extends Superclass {
    foo() {
        console.log('foo');
    }
};

let BarMixin = (Superclass) => class extends Superclass {
    bar() {
        console.log('bar');
    }
};

let BazMinxin = (Superclass) => class extends Superclass {
    baz() {
        console.log('baz');
    }
};

// 接收一个基础类 BaseClass 和任意数量的混入类 Mixins，返回一个融合了所有混入类功能的新类
function mix(BaseClass, ...Mixins) {
    /* 
        使用 reduce 迭代 Mixins 数组，将每个混入类依次应用到累积结果上
        
        reduce 是 JavaScript 数组的一个高阶函数，用于将数组元素 “累积” 为单个值（也可用于复杂的数组转换）
        它通过迭代数组，对每个元素执行回调函数，并将结果传递给下一次迭代，最终得到一个汇总结果
        
        迭代过程：
        每个 current（当前混入类）是一个函数，它接收上一步的 accumulator（累积的类）作为参数
        返回一个继承自 accumulator 并添加了自身功能的新类
    */
    return Mixins.reduce((accumulator, current) =>
        current(accumulator),  // 当前混入类接收累积类作为参数，返回新的融合类
        BaseClass);  // 初始值：从基础类开始
}

class Bus extends FooMixin(BarMixin(BazMinxin(Vehicle))) {}

class Bus1 extends mix(Vehicle, FooMixin, BarMixin, BazMinxin) {}

let b = new Bus();  // 与 let b = new Bus1(); 结果相同
b.foo();  // foo
b.bar();  // bar
b.baz();  // baz
```

> 很多 `JavaScript` 框架（`React`）已抛弃混入模式，转向组合模式（把方法提取到独立的类和辅助对象，再把它们组合起来，但不使用继承）
