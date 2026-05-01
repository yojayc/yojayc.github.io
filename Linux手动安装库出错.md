---
title: Linux手动安装库出错
date: 2021-09-04 12:26:07
tags:
	- linux
categories: linux
---

服务器上没有`root`权限，管理员用命令帮忙装的版本太低了，所以需要手动安装高版本的库

但是装完之后发现`lib`目录下只有`.cmake`文件，没有`.so`文件

问题在于`cmake`之后没有执行`make`就直接执行`make install`了。在`cmake`后执行`make`，再执行`make install`后安装正常

```
cd $HOME/CGAL-5.3
mkdir build
cd build
cmake ..                                                                          # configure CGAL
make install
```
