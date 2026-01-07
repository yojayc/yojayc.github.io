---
title: 将Markdown源码上传到Github
date: 2026-01-07 10:42:32
tags:
	- Markdown
categories: Markdown
---

## 简介

使用 `hexo` 的部署方法

```bash
hexo generate  // hexo g
hexo deploy  // hexo d
```

只能将编译后的网页推送到 `Github` 仓库，无法推送 `Markwon` 源文件。

可以在仓库中创建一个分支，将 `Markwon` 文件对应的文件夹推送到这个分支。

在本地配置完成后，后续只需在对应的文件夹中执行

```bash
git add .
git commit -m "Add my blog source files"
git push -u origin source-branch
```

就可以将 `Markdown` 源代码上传到对应的分支

## 初始化`Git`

在需要上传的文件夹目录初始化 `Git`，并创建新的源码分支（例如`source-branch`）


```bash
git init
git checkout -b source-branch
```

## 添加/提交文件

将需要上传的文件夹目录添加到 `Git`

```bash
git add .
git commit -m "Add my blog source files"
```

## 将 `source-branch` 推送到 `Github` 仓库

```bash
git remote add origin <Github仓库地址>
git push -u origin source-branch
```

![`Github`仓库地址](githubAddr.png)

`Github` 仓库地址是 `Github` 仓库中 `Code` 按钮下方展开显示的链接选项


<br>

<span style="color:red">注：</span>

直接输入 `git push -u origin source-branch` 会提示输入用户名和密码，但是 `Github` 不再
支持使用账号密码进行 `Git https` 推送，可以采用 [`ssh` 密钥](`ssh`密钥)的方式进行推送


## 参考

https://blog.csdn.net/Dasi_C_upup/article/details/151193854

[`ssh`密钥]:https://blog.csdn.net/Dasi_C_upup/article/details/151193854
