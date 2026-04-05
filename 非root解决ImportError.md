---
title: 非root解决ImportError
date: 2021-09-08 11:17:56
tags:
	- linux
categories: linux
---

执行代码时出现题述问题

执行下面的命令发现没有`GLIBCXX_3.4.26`对应的版本

```
strings /home/app/anaconda3/lib/libstdc++.so.6 | grep GLIBCXX
```

根据[stackoverflow](https://stackoverflow.com/questions/59921248/how-to-update-libstdc-so-6-or-change-the-file-to-use-on-tensorflow-python)上的操作，在`anaconda/lib`下发现有`GLIBCXX_3.4.26`的版本

```
strings /home/app/anaconda3/lib/libstdc++.so.6 | grep GLIBCXX
```

再根据[github](https://github.com/lhelontra/tensorflow-on-arm/issues/13)上的回答，在`./bashrc`中执行

```
export LD_LIBRARY_PATH=/home/app/anaconda3/lib
```

指定`libstdc++.so.6`所在的目录

最后重新执行代码不再报错

# 参考

https://stackoverflow.com/questions/59921248/how-to-update-libstdc-so-6-or-change-the-file-to-use-on-tensorflow-python

https://github.com/lhelontra/tensorflow-on-arm/issues/13
