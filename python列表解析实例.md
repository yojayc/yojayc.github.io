---
title: python列表解析实例
date: 2021-10-28 09:45:15
tags:
	- python
categories: python
---

# if起<span style="color:red">条件判断</span>作用，满足条件的，返回最终生成的列表

```
[i for i in range(k) if condition]
```

```
[i for i in range(10) if i%2 == 0]

output:

[0, 2, 4, 6, 8]
```

# if...else用来<span style="color:red">判断或赋值</span>，满足条件的i以及j生成最终的列表

```
[i if condition else j for exp]
```

```
[i if i == 0 else 100 for i in range(10)]

output:

[0, 100, 100, 100, 100, 100, 100, 100, 100, 100]

```

应用在代码中：

```
state_dict = {
            k: v
            for k, v in state_dict.items()
            if k in model_dict and v.shape == model_dict[k].shape
        }
```

# 参考

https://blog.csdn.net/ZK_J1994/article/details/72809260

https://github.com/meder411/Tangent-Images/blob/master/experiments/semantic_segmentation/ss/models/build.py
