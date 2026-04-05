---
title: 'Dockerfile unable to access ‘.git/‘: Failed to connect to gitlab.com'
date: 2021-09-10 10:51:25
tags:
	- linux
	- docker
categories: linux
---

# 问题

在命令行手动`build`一个`dockerfile`时无法连接到`git`。

`Dockerfile`中的系统和本地的不同，适用于本地的配置直接在`Dockerfile`中使用无效

```
git config --global http.proxy 'http://172.31.xx.xx:808'
git config --global https.proxy 'https://172.31.xx.xx:808'
```

在`Dockerfile`中使用`ifconfig`命令提示

```
/bin/sh: 1: ifconfig: not found
```

无法找到对应的`IP`

# 解决方法

直接在本地下载好，使用`COPY`命令复制到`Docker`中

# 注意事项

下载好的文件和`Dockerfile`要在同一级目录，因为`COPY` 和 `ADD` 命令不能拷贝上下文之外的本地文件

`COPY`命令要放在运行原来`git`命令的`RUN`命令前

```
COPY eigen /usr/local/src/eigen
RUN cd /usr/local/src \
    # && ifconfig \
    # && git config --global http.proxy 'http://172.31.70.88:808' \
    # && git config --global https.proxy 'https://172.31.70.88:808' \
    # && git clone https://gitlab.com/libeigen/eigen.git \
    # && COPY /data/cuiyujie/lib/Spherical-Package/eigen . \
    && cd eigen \
    && mkdir build \
    && cd build \
    && cmake .. \
    && make install -j 4
```

否则放到其它地方会重新构建一个`Docker`，又要重新执行一遍前面的命令

# 参考

https://www.cnblogs.com/sparkdev/p/9573248.html

https://blog.csdn.net/qq_28880087/article/details/110441110
