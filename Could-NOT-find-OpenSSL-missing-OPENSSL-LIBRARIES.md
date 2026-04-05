---
title: 'Could NOT find OpenSSL (missing: OPENSSL_LIBRARIES)'
date: 2021-09-03 20:36:45
tags:
	- linux
categories: linux
---

手动安装`cmake`，执行`./bootstrap`后出现标题所示错误提示，因为这一步出错，所以后面的步骤都无法继续进行

一开始以为是服务器上没有装`openssl`，使用`openssl version`命令发现有对应的版本，但是路径下没有`include`等文件夹

接着手动安装`openssl`，并且设置临时系统变量

```
export OPENSSL_ROOT_DIR=/data/lib/openssl-1.1.1k
export OPENSSL_INCLUDE_DIR=/data/lib/openssl-1.1.1k/include
```

重新执行`./bootstrap`后没有报错，成功安装

# 参考

https://github.com/substack/libssh/issues/1
