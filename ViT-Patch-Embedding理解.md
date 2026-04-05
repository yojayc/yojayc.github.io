---
title: ViT Patch Embedding理解
date: 2021-06-11 17:06:43
tags:
	- 计算机视觉
categories: 计算机视觉
---

`ViT(Vision Transformer)`中的`Patch Embedding`用于将原始的2维图像转换成一系列的1维`patch embeddings`。

假设输入图像的维度为 $H \times W \times C$，分别表示高，宽和通道数。

`Patch Embeeding`操作将输入图像分成 $N$ 个大小为 $P^2C$ 的 `patch`，并`reshape`成维度为 $N \times (P^2C)$ 的`patches`块 $x_p, x_p \in \mathbb{R}^(N \times (P^2C))$。其中 $N=\frac{HW}{P^2}$ ，表示分别在二维图像的宽和高上按 $P$ 进行划分，每个`patch`块的维度为 $P^2C$，再通过线性变换将`patches`投影到维度为 $D$ 的空间上，也就是直接将原来大小为 $H \times W \times C$ 的二维图像展平成 $N$ 个大小为 $P^2C$ 的一维向量 $x_p^', x_p^' \in \mathbb{R}^(N \times (P^2C))$，

上述的操作等价于对输入图像 $H \times W \times C$ 执行一个内核大小为 $P \times P$，步长为 $P$ 的卷积操作（虽然等价，但是`ViT`逻辑上并不包含任何卷积操作）。

卷积的输出计算公式为 $\left \lfloor \frac{n+2p-f}{s}+1 \right \rfloor$，将输入图像的宽和高分别带入得到 $\left \lfloor \frac{H+O-P}{P}+1 \right \rfloor = \left \lfloor \frac{H}{P} \right \rfloor, \left \lfloor \frac{W+O-P}{P}+1 \right \rfloor = \left \lfloor \frac{W}{P} \right \rfloor$，相乘之后就得到 $N$，等价于将输入图像划分成 $N$ 个大小为 $P^2C$ 的 `patch` 块。

代码如下：

```
class PatchEmbed(nn.Module):
  """
    Image to Patch Embedding
  """

  def __init__(self, img_size=224, patch_size=16, in_chans=3, embed_dim=768):
    super().__init__()
    img_size = (img_size, img_size)
    patch_size = (patch_size, patch_size)
    num_patches = (img_size[1] // patch_size[1]) * (img_size[0] // patch_size[0])
    self.img_size = img_size
    self.patch_size = patch_size
    self.num_patches = num_patches

    # 
    # embed_dim表示切好的图片拉成一维向量后的特征长度
    # 
    # 图像共切分为N = HW/P^2个patch块
    # 在实现上等同于对reshape后的patch序列进行一个PxP且stride为P的卷积操作
    # output = {[(n+2p-f)/s + 1]向下取整}^2
    # 即output = {[(n-P)/P + 1]向下取整}^2 = (n/P)^2
    # 
    self.proj = nn.Conv2d(in_chans, embed_dim, kernel_size=patch_size, stride=patch_size)

  def forward(self, x):
    B, C, H, W = x.shape
    assert H == self.img_size[0] and W == self.img_size[1], \
      f"Input image size ({H}*{W}) doesn't match model ({self.img_size[0]}*{self.img_size[1]})."
    x = self.proj(x).flatten(2).transpose(1, 2)
    return x  # x.shape is [8, 196, 768]
```

其中卷积操作`self.proj`之后接着一步`flatten(2)`展平操作，表示将`patch`投影到维度为 $D=P^2$ 的空间上。最后进行转置操作，表示输入图像经过转换后生成长度为 `196`($14 \times 14$ ，表示共有`196`个`patches`)，维度为`768`($3 \times 16 \times 16$)的特征向量。

# 参考

https://zhuanlan.zhihu.com/p/356155277
