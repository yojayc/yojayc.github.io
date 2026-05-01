---
title: Spherical Package编译记录
date: 2021-09-12 15:45:05
tags:
	- docker
	- linux
	- 包安装
categories: linux
---

最近要用到`Spherical-Package`，这个包有两种安装方法，一种是通过`Docker`安装，另一种是直接手动安装。但是服务器上网不方便，所以一开始先手动装。

手动装的问题基本上都是没有`root`权限、安装版本不匹配、依赖错误等。最后经过一番折腾装好了，但是测试的时候还是失败，也找不到问题出在哪里。猜测可能是手动装的`cgal`有问题，因为通过`apt-get`安装的`cgal`版本太低，所以只能手动装，但是无奈运行不起来。

因为要用这个库去处理数据，所以必须装好，太难了。后面开始用`Docker`装。

一开始在`Docker Hub`上找到了已经装好的`Spherical-Package`，结果下下来发现运行不了，运行测试样例也是失败的。这个Hub是去年上传的，版本也比较低，不支持新的函数。

后面就先尝试在`Linux`上连接网络，先用别人的代码进行登录，但是

```
ping www.baidu.com
```

的时候总是连接超时，说明还是没有连上网。 接着打开图形界面的`firefox`，在网页登录界面登录后成功`ping`通。


后面又遇到几个问题，最主要的就是选择的`Ubuntu`镜像版本太低，里面的`libcgal-dev`库的版本也很低，装好了还是跑不起来。而且因为系统的限制还装不了新版本，除非再自己手动安装，但是这需要删掉系统上的一些依赖库，重新装这些依赖库的时候又会冲突。最后在保证`cuda`版本和本地主机上一样的前提下选择了最高的`Ubuntu`版本作为基础镜像，通过`Docker`成功装好了`Spherical-Package`库的环境，真不容易。


需要注意：

`torch`的版本不能太高，否则`docker`装好了还是会报错。试过版本在`1.4-1.6`之间都行，`1.8`会报错

# 参考

https://github.com/meder411/Spherical-Package

https://blog.csdn.net/YoJayC/article/details/120175550?spm=1001.2014.3001.5501 

https://blog.csdn.net/YoJayC/article/details/120098099?spm=1001.2014.3001.5501

https://blog.csdn.net/YoJayC/article/details/120209482?spm=1001.2014.3001.5501

https://blog.csdn.net/YoJayC/article/details/120217018?spm=1001.2014.3001.5501

https://blog.csdn.net/YoJayC/article/details/120218464?spm=1001.2014.3001.5501

https://blog.csdn.net/YoJayC/article/details/120222959?spm=1001.2014.3001.5501

https://blog.csdn.net/YoJayC/article/details/120243520?spm=1001.2014.3001.5501

https://blog.csdn.net/YoJayC/article/details/120242447?spm=1001.2014.3001.5501
