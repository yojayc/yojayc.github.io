---
title: manifest.json 代码理解
date: 2025-10-21 12:05:05
tags:
	- JavaScript
	- 代码理解
categories: JavaScript
---

<!-- 给一个 `Chrome` 扩展程序的 `manifest.json` 文件添加了理解注释 -->

```json
{
   // 定义扩展在浏览器工具栏中的按钮（即 “动作按钮”）
   "action": {
      "default_icon": "icons/ic_16.png",  // 按钮默认显示的图标（16x16）
      "default_popup": "html/popup.html",  // 点击按钮时弹出的页面（html/popup.html），通常用于展示功能界面（如提取结果）
      "default_title": "Turbo Email Extractor"  // 鼠标悬停在按钮上时显示的提示文字
   },
   // 定义扩展的背景服务
   "background": {
      // 指定背景服务的脚本文件, 用于处理扩展的后台逻辑（如监听事件、持久化数据等）
      // service worker 是无界面的，生命周期由浏览器管理，不支持 DOM 操作
      // DOM（Document Object Model，文档对象模型）操作指的是通过代码对 HTML 或 XML 文档的结构、内容和样式进行动态修改的过程
      "service_worker": "js/background.js"
   },
   // 定义内容脚本（注入到网页中的脚本，用于操作网页 DOM 或数据）
   "content_scripts": [ {
      // 注入到匹配网页的样式表（css/contentScripts.css），用于修改网页样式
      "css": [ "css/contentScripts.css" ],
      // 注入到匹配网页的脚本（js/contentScripts.js），核心逻辑（如提取网页中的邮件地址）通常在这里实现
      "js": [ "js/contentScripts.js" ],
      // 匹配的网页 URL 规则，<all_urls> 表示所有 HTTP/HTTPS/FTP 等网页
      "matches": [ "\u003Call_urls>" ],
      // 脚本注入时机，document_start 表示在网页 DOM 开始解析时注入（早于 document_ready）
      // 
      // document_start:
      // 浏览器刚刚开始解析 HTML 文档，尚未构建任何 DOM 节点，<html> 标签甚至都未被解析
      // 此时，文档处于最早期的加载阶段，仅完成了资源的初始获取，尚未开始实质性的 DOM 树构建
      // 适合执行不需要依赖 DOM 的初始化操作（如设置全局变量、注册事件监听框架等）
      // 
      // document_ready:
      // 对应 DOMContentLoaded 事件触发的时刻，即 HTML 文档完全解析并构建出完整的 DOM 树
      // 此时无需等待样式表、图片、iframe 等外部资源加载完成
      // DOM 树已完整可用，可以安全地操作任何 DOM 元素（如查询、修改、绑定事件等）
      // 若存在阻塞 DOM 解析的脚本（如同步 <script>），会延迟 document_ready 的触发时间
      "run_at": "document_start"
   } ],
   "description": "Extract emails from all web pages",
   // host_permissions 声明扩展需要访问的主机权限，<all_urls> 表示允许访问所有 URL 的网页
   // \u003C 表示 '<' 的转义序列
   // \u 后跟四位十六进制数字是 Unicode 转义序列格式，用于表示特定的 Unicode 字符
   // 003C 对应 Unicode 字符集中小于号(<)的代码点
   "host_permissions": [ "\u003Call_urls>" ],
   // 定义扩展在不同场景下显示的图标
   "icons": {
      "128": "icons/ic_128.png",  // 安装时的提示、应用商店展示等
      "16": "icons/ic_16.png",  // 扩展管理页面、地址栏图标等
      "48": "icons/ic_48.png"  // 扩展详情页
   },
   // 扩展的公钥（用于标识扩展的唯一性，通常由浏览器自动生成，发布到应用商店时需要）
   "key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwE/GAGNbengnDoGO4v5onC9CSpzyZm/i33QPKOxVw1OLY2cmqJgcX/t5NnWw7AzQchfwoB35+XqwJcaqkTLNNnM53FsrX938xqONasC17Be+Tih41jAjCkAnQWtokZxFv23vChuCOSlUmKHmwRLtag0/rJTbZvUED29irrZVDX0cedqhNFZlTJ/Sk9WDr26pl56cgMNxaVXB3vhpP7CHNb5C3yAHVJUPOOhxk2LAavb+sjSUXS8Q4DMBz2pAIYOoUAdrweuhU48pFU0RrzqgMtZxpnz15Sd26yk0FeIndKM+FFV5n7lV5C1q3DihHkxBCdnEgEmjdG3Hq4n+1UklGwIDAQAB",
   "manifest_version": 3,
   "name": "Turbo Email Extractor",
   /*
      声明扩展需要的功能权限
      tabs：允许操作浏览器标签页（如获取标签信息）
      activeTab：仅允许访问当前激活的标签页（临时权限，提高安全性）
      storage：允许使用浏览器的本地存储（chrome.storage）保存数据（如提取的邮件）
      background：允许访问背景服务（与 background 配置配合）
      webRequest：允许监听和拦截网页请求（可能用于从网络请求中提取邮件）
   */
   "permissions": [ "tabs", "activeTab", "storage", "background", "webRequest" ],
   // 扩展的自动更新地址（Chrome 扩展商店的标准更新接口）
   "update_url": "https://clients2.google.com/service/update2/crx",
   "version": "1.1",
   // 声明允许网页（而非扩展自身）访问的扩展资源
   "web_accessible_resources": [ {
      "matches": [ "\u003Call_urls>" ],  // 允许哪些网页访问这些资源，<all_urls> 表示所有网页均可访问
      "resources": [ "images/*" ]  // resources: 允许访问的资源路径（images/* 表示 images 目录下的所有文件，如图标、图片等）
   } ]
}
```