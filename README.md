# 六神占卜 - 传统占卜应用

一个基于传统六神占卜的Web应用，支持PWA安装，可在手机和电脑上使用。

## 功能特点

- 📱 **PWA支持** - 可安装到手机桌面，支持离线使用
- 🗓️ **万年历** - 显示农历日期和时辰信息
- 🔮 **六神占卜** - 传统占卜方法，根据时间进行预测
- 📝 **历史记录** - 保存占卜结果，支持搜索和删除
- 🎨 **响应式设计** - 适配手机、平板和电脑

## 在线使用

### 方法一：GitHub Pages（推荐）
访问：`https://你的用户名.github.io/仓库名/`

### 方法二：本地运行
1. 下载项目文件
2. 在项目目录运行：`python -m http.server 8001`
3. 浏览器访问：`http://localhost:8001`

## 手机使用指南

### 局域网访问（临时）
1. 确保手机和电脑在同一WiFi网络
2. 电脑运行：`python -m http.server 8001 --bind 0.0.0.0`
3. 查看电脑IP地址：`ipconfig`（Windows）或 `ifconfig`（Mac/Linux）
4. 手机浏览器访问：`http://电脑IP:8001`

### PWA安装到桌面
1. 使用HTTPS地址访问（GitHub Pages或其他HTTPS服务）
2. **Android**: Chrome/Edge会自动提示"添加到主屏幕"
3. **iOS**: Safari浏览器 → 分享按钮 → "添加到主屏幕"

## 部署到GitHub Pages

1. **创建GitHub仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/仓库名.git
   git push -u origin main
   ```

2. **启用GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source选择 "Deploy from a branch"
   - Branch选择 "main"，文件夹选择 "/ (root)"
   - 点击Save

3. **访问应用**
   - 等待几分钟部署完成
   - 访问：`https://你的用户名.github.io/仓库名/`

## 项目结构

```
├── index.html          # 主页面
├── style.css          # 样式文件
├── script.js          # 主要逻辑
├── sw.js              # Service Worker（PWA支持）
├── manifest.json      # PWA配置文件
├── icon-192.svg       # SVG图标
├── icon-192.png       # PNG图标（192x192）
├── icon-512.png       # PNG图标（512x512）
├── .htaccess          # Apache配置
└── README.md          # 说明文档
```

## 技术特性

- **纯前端** - 无需后端服务器
- **本地存储** - 使用localStorage保存历史记录
- **PWA** - 支持离线使用和桌面安装
- **响应式** - 适配各种屏幕尺寸
- **传统文化** - 基于传统六神占卜理论

## 浏览器兼容性

- Chrome/Edge 67+
- Firefox 63+
- Safari 11.1+
- 移动端浏览器

## 常见问题

**Q: 手机访问不了电脑上的应用？**
A: 检查是否在同一WiFi网络，电脑防火墙是否允许，IP地址是否正确。

**Q: 无法安装到桌面？**
A: 需要使用HTTPS地址访问，建议部署到GitHub Pages。

**Q: 历史记录丢失？**
A: 历史记录保存在浏览器本地，清除浏览器数据会丢失。不同设备间不会同步。

**Q: 占卜结果准确吗？**
A: 本应用仅供娱乐参考，请理性对待占卜结果。

## 开源协议

MIT License - 可自由使用、修改和分发。