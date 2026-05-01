---
title: docker 保存镜像
date: 2021-09-08 21:07:12
tags:
	- docker
	- windows
	- 深度学习
categories: docker
---

因为服务器上无法联网下载`docker`镜像，所以通过`windows`本地下载对应的镜像，之后再传到服务器上。

本地安装完`docker`后出现`Failed to deploy distro docker-desktop`错误，主要原因是`WSL2`，尝试了很多方法都没有解决。取消勾选`docker-General-Use the WSL 2 base engine`后能够正常启动`docker`。

本地下载完镜像之后先使用

```
docker save -o target_location image_names
```

命令进行压缩，镜像有`16G`，存储的压缩文件也是`16G`，而且耗时太久，过了一天命令还没执行完


最后改成

```
docker save myimage:latest | gzip > myimage_latest.tar.gz
```

用`gzip`进行压缩，保存的文件明显变小，几分钟就压缩完了

# 注意事项

`docker save`时要使用镜像名，而不是`Image ID`，否则服务器导入镜像之后`REPOSITORY`和`TAG`都是`<none>`，导致无法启动镜像

```
REPOSITORY   TAG       IMAGE ID       CREATED              SIZE
<none>       <none>    6d58f24de00f   About a minute ago   16.9GB
```

删除镜像时要先删除运行镜像的`container`

`docker load`时要加上`-i`，之后再接着`image name`

感觉`import`和`load`差别不是很大，具体可以看[这篇文章](https://blog.csdn.net/guizaijianchic/article/details/78324646)

# 参考

https://blog.csdn.net/guizaijianchic/article/details/78324646

https://docs.docker.com/reference/cli/docker/image/save/

https://github.com/docker/for-win/issues/8204

https://blog.csdn.net/tongzidane/article/details/115355668

https://blog.csdn.net/m0_37942145/article/details/105810236

https://blog.csdn.net/m0_37942145/article/details/105810236

https://yeasy.gitbook.io/docker_practice/di-yi-bu-fen-ru-men-pian/04_image/4.6_other

