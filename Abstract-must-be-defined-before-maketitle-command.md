---
title: Abstract must be defined before maketitle command. Please move it
date: 2022-03-31 21:15:03
tags: 
	- latex
	- 论文
categories: latex
---

最近在使用[acmart-primary](https://www.acm.org/publications/proceedings-template)的`sample-sigconf.tex`模版时，编译文档总是会出现这个问题。

`sample-sigconf.tex` 中的代码示例如下：

```
\begin{document}

\title{The Name of the Title is Hope}

\author{Ben Trovato}

.
.
.

\begin{abstract}
...
\end{abstract}

\begin{CCSXML}
...
\end{CCSXML}

\ccsdesc[500]{...}

\keywords{...}

\begin{teaserfigure}
\end{teaserfigure}

\maketitle
```

而`acmart.pdf`的官方文档中`saveabstract`的定义如下

```
\@saveabstract And saving the abstract
1554 \long\def\@saveabstract#1{\if@ACM@maketitle@typeset
1555 \ClassError{\@classname}{Abstract must be defined before maketitle
1556 command. Please move it!}\fi
1557 \long\gdef\@abstract{#1}}
1558 \@saveabstract{}
```

可以看出，`sample-sigconf.tex`中`abstract`确实是定义在`maketitle`前的。

后来根据[stackexchange](https://tex.stackexchange.com/questions/385029/abstract-does-not-appear-with-acmart-latex-template)中的回答，将`\begin{document}`置于`\maketitle`前，可以解决这个问题
