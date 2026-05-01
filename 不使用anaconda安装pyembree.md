---
title: 不使用anaconda安装pyembree
date: 2021-09-26 14:14:27
tags:
	- docker
	- linux
categories: linux
---

`pyembree`官方给出的安装方法是通过`conda`进行安装

```
conda install -c conda-forge pyembree
```

并没有`pip`的版本，想要安装`pyembree`就得先装`anaconda`，在`docker`里有点不方便。

在[github](https://github.com/scopatz/pyembree/issues/23)上查到可以通过`.tar.gz`文件进行手动安装

首先将`embree.bash`中的内容保存到本地文件`e.bash`里，之后在命令行执行

```
bash e.bash
```

最后更新环境变量

```
export LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH
```

安装成功

# 参考

https://github.com/scopatz/pyembree/issues/23

https://github.com/mikedh/trimesh/blob/master/docker/builds/embree.bash
