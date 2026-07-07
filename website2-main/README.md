# React + TypeScript + Vite

# Kasplex 官网项目

本项目是 Kasplex 的官方网站，用于 Kasplex 品牌的宣传和展示。项目基于 React + TypeScript + Vite 构建，提供了现代化的开发体验和高效的打包性能。

---

## 项目运行相关配置

### 1. 安装依赖
在项目根目录下运行以下命令，安装项目所需的依赖：
```bash
npm install
```
### 2. 启动开发服务器
运行以下命令，启动开发服务器，实时预览项目：
```bash
npm run dev
```

### 3. 构建生产版本
运行以下命令，构建生产版本的项目，优化代码和资源：
```bash
npm run build
```
构建完成后，产物将生成在 dist 目录下。
### 4. 预览生产版本
运行以下命令，预览生产版本的项目：
```bash
npm run preview
```
---


## 技术栈
- React
- Antd
- TypeScript
- Vite
- 其他相关依赖
  - 请查看 package.json 文件中的 dependencies 字段


### 发布记录
2025-12-24 v1.0.8
- 添加了页面evm 和对应展示内容
- 修改index.html 中的meta标签 相关配置 允许 搜索引擎 搜索

2025-12-24 v1.0.9
- Evm 界面增加 kas.fun（LaunchPad）和Foresee（Prediction Market）

2026-03-04 v1.0.11
- 导航修改 KRC20 -> DOCS 下拉包含 krc20 和 evm doc
- 底部去掉 doc 入口
- EVM 中关于 kas.fun 和 kroko 内容更新

2026-03-12 v1.0.13
- evm 新增Bitget Wallet 项目方