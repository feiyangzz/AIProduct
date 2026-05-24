# 项目管理系统

基于 Vue 3 + Vite + Element Plus + TypeScript + Axios + Pinia 构建的前端项目管理系统。

## 技术栈

- **构建工具**: Vite 8
- **框架**: Vue 3 (Composition API + `<script setup>`)
- **UI 组件库**: Element Plus
- **语言**: TypeScript
- **HTTP 客户端**: Axios
- **状态管理**: Pinia
- **路由**: Vue Router

## 功能模块

- **登录认证** — 用户登录与路由守卫
- **仪表盘** — 项目/任务统计概览
- **项目管理** — 项目的增删改查、搜索与筛选
- **任务看板** — Kanban 看板视图，按状态分组管理任务
- **团队成员** — 查看团队成员及其任务/项目参与情况

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 演示账号

| 用户名 | 密码   |
|--------|--------|
| admin  | 123456 |

## 项目结构

```
src/
├── api/           # API 接口层（Mock 数据）
├── constants/     # 常量与枚举映射
├── layouts/       # 布局组件
├── mock/          # Mock 数据库（localStorage 持久化）
├── router/        # 路由配置
├── stores/        # Pinia 状态管理
├── styles/        # 全局样式
├── types/         # TypeScript 类型定义
├── utils/         # 工具函数（Axios 封装）
└── views/         # 页面组件
    ├── dashboard/
    ├── login/
    ├── projects/
    ├── tasks/
    └── team/
```

## 说明

当前版本使用 Mock API + localStorage 模拟后端数据，便于本地开发演示。接入真实后端时，只需替换 `src/api/` 中的接口实现，Axios 请求封装已就绪。
