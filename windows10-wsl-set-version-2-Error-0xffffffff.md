---
title: 'windows10 : wsl --set-version 2 Error: 0xffffffff'
date: 2021-09-09 16:38:15
tags:
	- windows
	- linux
categories: linux
---

在`windows`上安装了`Linux`子系统，而且安装了`wsl2`更新，但是执行

```
wsl --set-version Ubuntu 2
```

时出现`Error: 0xffffffff`错误，导致无法更新到`wsl2`。后来查到出错是因为`53`号端口被占用，将占用端口的程序关掉之后更新成功。


端口占用问题同样导致`windows`版`docker`无法启动`WSL2`，关掉程序后启动成功

# 参考

https://www.cnblogs.com/ayanmw/p/14868526.html

https://github.com/microsoft/WSL/issues/4364

https://blog.csdn.net/LaughingMei/article/details/109736965

https://blog.csdn.net/zhouxukun123/article/details/79383130

https://www.derekwei.com/2020/09/wsl-2-%E5%AE%89%E8%A3%85%E5%92%8C%E5%8D%87%E7%BA%A7%E8%BF%87%E7%A8%8B%E4%B8%AD%E9%94%99%E8%AF%AF%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E6%B3%95/
