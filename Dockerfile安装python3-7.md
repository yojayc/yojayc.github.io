---
title: Dockerfile安装python3.7
date: 2021-09-11 20:00:34
tags:
	- python
	- docker
	- linux
categories: python
---

用`Dockerfile`构造镜像时需要用到`python3.7`，但是`python`默认安装的版本是`3.5`。需要手动安装`python3.7`

安装的主要代码如下：

```
wget https://www.python.org/ftp/python/3.7.3/Python-3.7.3.tgz
tar -xvf Python-3.7.3.tgz
cd Python-3.7.3
./configure --enable-loadable-sqlite-extensions
make
make install
```

# 遇到的问题

使用`tar`命令时会报错

```
tar (child):XXX: Cannot open: No such file or directory
```

说明`wget`并不在当前目录，使用`wget -P` 指定目录安装后还是会报同样的错误，最后在本地下载好对应的`python`文件，放到和`Dockerfile`同一级的目录中，然后用`COPY`命令拷贝到`docker`中执行安装。

```
COPY Python-3.7.3.tgz /usr/local/src/
```

`ModuleNotFoundError: No module named '_ctypes'`，原因是缺少`libffi-dev`库
在安装`python`前执行

```
apt-get install libffi-dev
```

# 参考

https://blog.csdn.net/u012768124/article/details/104758948

https://blog.csdn.net/wang725/article/details/79905612

https://blog.csdn.net/leiyu1139/article/details/53428086
