---
title: Transformer可视化概念理解
date: 2021-06-17 15:10:55
tags:
	- 可视化
	- 算法
categories: 可视化
---

最近需要对`Transformer`网络的中间层进行可视化，便于分析网络，在此记录一些常用到的概念。


常用到的方法主要是`Attention Rollout`和`Attention Flow`，这两种方法都对网络中每一层的`token attentions`进行递归计算，主要的不同在于假设低层的`attention weights`如何影响到高层的信息流，以及是否计算`token attentions`之间的相关性。


为了计算信息从输入层传播到高层的嵌入方式，关键是考虑模型中残差连接以及`attention`权重。在一个`Transformer`块中，`self-attention`和前向网络都被残差连接包裹，也就是将这些模块的输入添加到输出中。当仅使用`attention weights`来近似`Transformers`中的信息流时，就忽略了残差连接。但是残差连接连接了不同层的对应位置，所以在计算`attention rollout`和`attention flow`时，用额外的权重来表示残差连接。给定一个有残差连接的`attention`模块，将$l+1$层的值计算为$V_{l+1}=V_l+W_attV_l$，其中$W_att$是`attention`矩阵，因此有$V_{l+1}=(W_att+I)V_l$。所以，为了解释残差连接，给`attention`矩阵增加一个单位矩阵，并且对新矩阵的权重重新规范化。最后生成**<span style="color:red">由残差连接更新的原始矩阵</span>**$A=0.5W_att+0.5I$。


此外，分析单个`attention head`需要考虑输入在通过`Transformer`块中位置级的前向网络后，各个`heads`之间混合的信息。使用`Attention Rollout`和`Attention Flow`能够单独分析每个`attention head`中的信息，但是为了简便，一般在所有的`attention heads`上平均每一层的`attention`来进行分析。

# 参考

https://blog.csdn.net/YoJayC/article/details/119702488?spm=1001.2014.3001.5502
