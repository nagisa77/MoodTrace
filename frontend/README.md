# MoodTrace 前端

基于 Vue 3 + Vite 的情绪日志应用，实现以下功能：

- 新建情绪日志，记录创建时间、事件、感受、想法、行为和后果，并保存在浏览器本地存储。
- 日志列表按创建时间倒序展示摘要（日期 + 事件 + 主要情绪）。
- 查看日志详情，支持删除并提供 AI 助手生成的引导式分析。

## 本地开发

```bash
npm install
npm run dev
```

默认开发服务器运行在 <http://localhost:5173/>。

## 构建发布

```bash
npm run build
npm run preview
```

## 技术栈

- [Vue 3](https://vuejs.org/) + `<script setup>`
- [Vue Router](https://router.vuejs.org/)
- Vite 构建工具
- 本地存储（`localStorage`）保存日志数据
