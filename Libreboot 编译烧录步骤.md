---
title: Libreboot 编译烧录步骤
date: 2026-05-31 20:05:51
tags:
	- BIOS
	- Libreboot
categories:
	BIOS
---

# 注意事项

- 准备 `SOP8 烧录夹` 和 `RaspBerry Pi PICO 开发板`

- <span style="color:red"><strong>读取和烧录主板上的 `BIOS` 芯片前断开 `CMOS` 电池和内置电池接口</strong></span>

- 在[**联想官网**](https://pcsupport.lenovo.com/us/en/products/laptops-and-netbooks/thinkpad-t-series-laptops/thinkpad-t480-type-20l5-20l6/downloads/ds502355-bios-update-utility-bootable-cd-for-windows-10-64-bit-linux-thinkpad-t480?category=BIOS%2FUEFI)下载 `1.52` 版本的 `BIOS` 升级程序，将 `BIOS` 更新为 `1.52` 版本

- 在 `Linux` 系统环境下进行编译和烧录

# 编译步骤

## 原生BIOS处理

1. 使用下述命令将 `1.52` 版本的 `BIOS` 升级程序重命名为 `t480_bios_update.img`

```
geteltorito -o t480_bios_update.img n24ur39w.iso
```

2. 使用 `lsblk` 找到 `u盘` 的符号名，再使用 `dd` 命令将升级程序写到 `u盘`

```
lsblk
dd if=t480_bios_update.img of=/dev/sdb bs=4M conv=fsync status=progress
```

3. 插上 `u盘`，重启电脑，按 `ENTER` 键进入 `Startup Interrupt Menu`，按 `F12`，选择 `u盘`，按数字 `2` 进行升级

## 编译

1. 下载 `lbmk` 进行编译

```
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com
git clone https://codeberg.org/libreboot/lbmk
cd lbmk
export XBMK_THREADS=4
sudo ./mk dependencies debian/ubuntu/mint  # 根据自己的操作系统进行选择
```

2. 在 [`roms` 镜像网站](https://mirrors.mit.edu/libreboot/stable/26.01rev1/roms/) 中下载自己电脑对应的版本 `libreboot-xx_t480_vfsp_16mb.tar.xz` 和 `PICO` 对应的版本 `libreboot-xx_serprog_pico.tar.xz`

3. 解压 `PICO` 对应的版本，按住 `PICO` 上的按钮与电脑连接，将解压后与 `PICO` 对应的 `.uf2` 文件拷贝到 `RPI_RP2` 文件夹中

`tar -xvf libreboot-xx_serprog_pico.tar.xz`

4. 使用 `dmesg` 查找 `PICO` 对应的符号名 `ttyACM0`

5. 使用 `inject` 命令将 `libreboot-xx_t480_vfsp_16mb.tar.xz` 注入到 `lbmk`

```
./mk inject libreboot-xx_t480_vfsp_16mp.tar.xz
```

6. 解压编译生成的 `libreboot-xx_t480_vfsp_16mb.tar.xz` 文件

# 烧录

## 连接

![PICO 与烧录夹连线示意图](pico_connection.png)

![PICO 实际连接图](pico_real_connection.png)

将 `PICO` 按图示与 `BIOS` 进行连接

## 备份

使用下述命令读取 `BIOS` 中原有的程序，对比两个文件的 `sha512sum` 值是否一致，确保连接稳定

```
sudo falshrom -p serprog:dev=/dev/ttyACM0 -r /backup/t480b1.bin
sudo falshrom -p serprog:dev=/dev/ttyACM0 -r /backup/t480b2.bin
sha512sum /backup/t480b*.bin
```

## 烧录

在 `libreboot-xx_t480_vfsp_16mb.tar.xz` 解压后的文件夹中选择 `seagrub_t480_vfsp_16mb_libgfxinit_txtmode_usqwerty.rom` 进行烧录

```
sudo flashrom -p serprog:dev=/dev/ttyACM0 -w seagrub_t480_vfsp_16mb_libgfxinit_txtmode_usqwerty.rom
```

# 参考

https://www.youtube.com/watch?v=iGKhsjvlSBQ

https://www.youtube.com/watch?v=TuY9Nh-G4dI

https://libreboot.org/docs/build