---
title: Attention Rollout
date: 2021-08-14 18:26:49
tags:
	- 计算机视觉
	- 人工智能
	- 自然语言处理
categories: 自然语言处理
---

# 问题陈述

![图1](rollout.png)

从图`1a`中的原始`attention`可以看出，只有在最开始的几层，不同位置的`attention`模式有一些区别，但是更高层中的`attention`权重更加一致。这表示随着模型层数的增加，嵌入的内容变得更加情境化，可能都带有类似的信息。此外，另一篇文章中表示注意力权重不一定与输入`token`的相对重要性相对应。

![图2](spearmanr.png)

作者使用输入消融法，`blank-out`方法来估计每个输入`token`的重要性。`Blank-out`用`UNK`逐个替换输入中的每个`token`，衡量其对预测正确类别的影响程度。接着计算网络最后一层类别`Embedding`的`attention`权重和`blank-out`方法算出的重要性得分之间的`Spearman`秩相关系数，发现除了第一层之外，其他层的相关系数都很低，证实了前述文章中的观点。从表2可知，输入梯度和重要性得分之间的`Spearman`秩相关系数同样也很低。

# Attention Rollout

给定一个模型和编码的`Attention`权重，`Attention rollout`递归计算每一层的`token attetions`。计算信息从输入层到更高层中的编码时，需要同时考虑模型的残差连接和`attention`权重，所以用额外表示残差连接的权重来增强`attention graph`。

给定一个具有残差链接的`attention`模块，将第$l+1$层的`attention`值表示成$V_{l+1}=V_t+W_attV_t$，其中$W_att$是`attention`矩阵，因此有$V_{l+1}=(W_att+I)V_l$。所以给`attention`矩阵增加一个单位矩阵来表示残差连接，然后重新归一化相加后的权重。计算的结果是$A=0.5W_att+0.5I$，$A$表示用残差连接更新后的原始`attention`。

给定一个$L$层的`Transformer`，目标是计算从$l_i$层所有位置到$l_j$层所有位置的`attention`，其中$j<i$（反向计算）。在`attention`图中，从$l_i$层位置`k`的结点`v`到$l_j$层位置`m`的结点`u`有多个连接两个结点的边，如果将每一条边的权重视为两个结点间信息传递的一部分，那么可以将该路径中所有边的权重相乘来计算有多少信息从`v`传递到了`u`。因为`attention`图的两结点间可能不止一条边，所以为了计算从`v`到`u`传递的信息总量，对两结点间所有可能的路径求和。在实际计算时，为了计算从$l_i$
到$l_j$的`attention`，递归地将下面所有层的注意力权重矩阵相乘

$$
\tilde{A}=\begin{cases}
A(l_i)\tilde{A}(l_(i-1)), & i>j \\
A(l_i), & i=j
\end{cases}
$$

在上述等式中，$\tilde{A}$是`Attention Rollout`，$A$是原始的`attention`，乘法运算是矩阵乘法。在计算输入`attention`时，将`j`设置成`0`。

总之，`Attention Rollout`就是计算从底层到高层的`Attention`矩阵的乘积

# 参考

[1].Sofia Serrano and Noah A. Smith. 2019. Is attention interpretable? In proceedings of the 57th Annual Meeting of the Association for Computational Linguistics. Association for Computational Linguistics
