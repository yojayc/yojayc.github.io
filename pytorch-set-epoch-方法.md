---
title: pytorch set_epoch()方法
date: 2022-03-21 21:15:47
tags:
	- pytorch
categories: pytorch
---

在分布式模式下，需要在每个 `epoch` 开始时调用 `set_epoch()` 方法，然后再创建 `DataLoader` 迭代器，以使 `shuffle` 操作能够在多个 `epoch` 中正常工作。 否则，`dataloader` 迭代器产生的数据将始终使用相同的顺序。

```
sampler = DistributedSampler(dataset) if is_distributed else None
loader = DataLoader(dataset, shuffle=(sampler is None),
                    sampler=sampler)
for epoch in range(start_epoch, n_epochs):
    if is_distributed:
        sampler.set_epoch(epoch)
    train(loader)
```

# 参考

https://docs.pytorch.org/docs/stable/data.html

https://zhuanlan.zhihu.com/p/97115875
