---
title: pytorch中tensor进行reshape操作后原始数据的顺序
date:  2021-11-19 14:47:29
tags:
	- python
	- pytorch
categories: pytorch
---

在`pytorch`中，经常需要对`tensor`进行`reshape`操作，使其符合特定网络的输入格式。在将网络的输

出重新`reshape`回输入前的形状时，`tensor`的特征是否还是按输入的顺序进行排列？


带着疑问做了下面的实验

```
x1 = torch.randn(2, 3)
x2 = torch.randn(2, 3)
x3 = torch.randn(2, 3)
x4 = torch.stack((x1, x2, x3), 0)

shape = x4.shape
print("x4:", x4.shape)
print("x4:\n", x4)
x4 = x4.reshape(x4.shape[0]*x4.shape[1], x4.shape[-1])
print("reshaped x4:", x4.shape)
print("reshaped x4:\n", x4)
x4 = x4.reshape(shape[0], shape[1], shape[-1])
print("recovered x4:\n", x4, x4.shape) # print("x5:\n", x5)

```

输出

```
x4: torch.Size([3, 2, 3])
x4:
 tensor([[[-1.2061,  0.0617,  1.1632],
         [-1.5008, -1.5944, -0.0187]],

        [[-2.1325, -0.5270, -0.1021],
         [ 0.0099, -0.4454, -1.4976]],

        [[-0.9475, -0.6130, -0.1291],
         [-0.4107,  1.3931, -0.0984]]])
reshaped x4: torch.Size([6, 3])
reshaped x4:
 tensor([[-1.2061,  0.0617,  1.1632],
        [-1.5008, -1.5944, -0.0187],
        [-2.1325, -0.5270, -0.1021],
        [ 0.0099, -0.4454, -1.4976],
        [-0.9475, -0.6130, -0.1291],
        [-0.4107,  1.3931, -0.0984]])
recovered x4:
 tensor([[[-1.2061,  0.0617,  1.1632],
         [-1.5008, -1.5944, -0.0187]],

        [[-2.1325, -0.5270, -0.1021],
         [ 0.0099, -0.4454, -1.4976]],

        [[-0.9475, -0.6130, -0.1291],
         [-0.4107,  1.3931, -0.0984]]]) torch.Size([3, 2, 3])
```

将`x1`, `x2`和`x3`三个`tensor`通过`stack`操作堆到一起后通过`reshape`操作改变维度的形状

接着再将`reshape`完的`tensor`变回原来的形状，发现输出数据的顺序和改变形状之前相同

表明在`reshape`过程中，`tensor`能够保持数据的顺序
