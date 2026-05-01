---
title: >-
  Error response from daemon: manifest for nvidia/cuda:latest not found:
  manifest unknown: manifest
date: 2021-09-09 20:45:41
tags:
  - linux
categories: linux
---

# 原因

> The "latest" tag for CUDA, CUDAGL, and OPENGL images has been deprecated on NGC and Docker Hub

`Docker Hub`中的`CUDA`, `CUDAGL`和`OPENGL`镜像已经弃用"`latest`"标签，直接使用

```
docker pull nvidia/cuda
```

或者在`Dockerfile`中指定

```
FROM nvidia/cuda:latest
```

都会出现

```
Error response from daemon: manifest for nvidia/cuda:latest not found: manifest unknown: manifest unknown
```

错误

# 解决方法

在`supported-tags`中找到与自己系统对应的`cuda`版本，并将`nvidia/cuda:latest`中的`latest`改成对应的版本

例如：

```
nvidia/cuda:10.0-cudnn7-devel-ubuntu16.04
```

# 参考

https://hub.docker.com/r/nvidia/cuda

https://gitlab.com/nvidia/container-images/cuda/blob/master/doc/supported-tags.md

https://blog.csdn.net/u011622208/article/details/113650011
