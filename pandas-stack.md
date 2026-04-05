---
title: pandas stack
date: 2021-07-21 10:15:01
tags:
	- pandas
categories: pandas
---

堆叠一个`DataFrame`意味着将最内层的列索引移动为最内层的行索引。其逆运算叫做反叠加。

![图1](f1.png)

堆叠（`stack`）是什么?-如果我们有多个索引列，通过将最内层的列级别移动到最内层的行级别来减少数据集列。所以堆栈是将`cols`的索引变到`rows`(最里面的)。如图2所示，经过`pt.stack()`操作后`marital_status`从列索引变为行索引

![图2](f2.png)

反叠加（`unstack`）是什么?-如果我们有多索引行，我们通过移动最内层的行级别到最内层的列级别来减少数据集行。所以`unstack`是将`rows`的索引变到`cols`的索引(最里面的)。如图3所示，经过`pt.stack().unstack()`操作后，`marital_status`又从行索引变回列索引

![图3](f3.png)
