---
title: Dockerfile基础镜像选择
date: 2021-09-11 21:32:58
tags:
	- docker
	- linux
categories: linux
---

`Dockerfile`的最开始都是`From xxx`，表示选择的基础镜像是什么版本，可以在`nvidia`的`gitlab`上选择版本。需要注意`nvidia/cuda:latest`的表示方式已经被弃用，可以看前面写的文章

例如

```
FROM nvidia/cuda:10.0-cudnn7-devel-ubuntu16.04
```

其中`10.0`是指`cuda`的版本

`cudnn7`指与`cuda10.0`对应的`cudnn`版本

`devel`指镜像中的`nvcc`包包含`cuda`

`ubuntu16.04`指镜像中`ubuntu`的版本


其中，除了`ubuntu`版本可以与本地不同之外，其余的都要和主机上的版本对应，否则运行`docker`将无法使用本地的`GPU`硬件。


`ubuntu`版本能选最高就选最高，因为低版本能安装的库版本也很低，无法使用一些新功能

# 参考

https://gitlab.com/nvidia/container-images/cuda/blob/master/doc/supported-tags.md

https://blog.csdn.net/u011622208/article/details/113650011

https://blog.csdn.net/YoJayC/article/details/120209482?spm=1001.2014.3001.5501
