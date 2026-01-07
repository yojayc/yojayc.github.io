---
title: Android 旧版本包问题
date: 2025-11-01 10:43:51
tags:
	- Android
categories:
	Android
---

```
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
```

可改为：

```
import androidx.core.app.ActivityCompat;
import androidx.appcompat.app.AppCompatActivity;
```
