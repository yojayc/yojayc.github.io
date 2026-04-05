---
title: kwargs.pop
date: 2021-06-14 19:41:14
tags:
	- python
categories: python
---

> [pop(key[, default])](https://docs.python.org/3/library/stdtypes.html#dict.pop) if key is in the dictionary, remove it and return its value, else return default. If default is not given and key is not in the dictionary, a KeyError is raised.

`kwargs.pop()`的作用是将字典中指定的键移除，并返回其对应的值。如果字典中没有指定的键，则返回默认值，没有设置默认值的话就报错。

```
d = {'a' :1, 'c' :2}
print(d.pop('c', 0)) # return 2
print(d) # returns {'a': 1}
print(d.get('c', 0)) # return 0
```

# 参考

https://www.cnpython.com/qa/50845
