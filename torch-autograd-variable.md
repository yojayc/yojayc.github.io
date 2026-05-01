---
title: torch.autograd.variable
date: 2021-08-03 15:33:53
tags:
	- pytorch
categories: pytorch
---

在`PyTorch0.4.0`之后`Variable` 已经被`PyTroch`弃用

`Variable`不再是张量使用`autograd`的必要条件

只需要将张量的`requires_grad`设为`True`该张量就会自动支持`autograd`运算


在新版的`PyTorch`中`Variable(tensor)`和`Varialbe(tensor, requires_grad)`还能继续使用，但是返回的是`tensor`变量，而不是`Variable`变量

使用`Variable.data`的效果和使用`tensor.data`一样

诸如`Variable.backward()`，`Variable.detach()`，`Varialbe.register_hook()`等方法直接移植到了`tensor`上，在`tensor`上可以直接使用同名的函数


此外，现在可以直接使用`torch.randn()`，`torch.zeros()`，`torch.ones()`等工厂方法直接用`requires_gard=True`属性生成`tensor`，例如

```
autograd_tensor = torch.randn((2, 3, 4), requires_grad=True)
```

# 参考

https://pytorch.org/docs/stable/autograd.html
