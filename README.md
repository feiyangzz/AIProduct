# 项目管理系统

基于 Vue 3 + Vite + TypeScript + Element Plus + Pinia + Axios 构建的前端项目管理系统。

## 技术栈

- **构建工具**: Vite 6
- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **UI 组件库**: Element Plus
- **状态管理**: Pinia
- **HTTP 客户端**: Axios
- **路由**: Vue Router 4

## 功能模块

- **登录认证** — JWT Token 登录（Mock 数据）
- **仪表盘** — 项目/任务统计概览、最近项目、待办任务
- **项目管理** — 项目 CRUD、搜索、分页
- **项目详情** — 项目信息、任务列表、团队成员
- **任务管理** — 任务 CRUD、按项目/状态筛选
- **团队成员** — 成员卡片展示、任务/项目统计

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

| 用户名 | 密码 |
|--------|------|
| admin  | 123456 |

## 项目结构

```
src/
├── api/           # API 接口层（含 Mock 数据）
├── constants/     # 常量与映射
├── layouts/       # 布局组件
├── router/        # 路由配置
├── stores/        # Pinia 状态管理
├── styles/        # 全局样式
├── types/         # TypeScript 类型定义
├── utils/         # 工具函数（Axios 封装）
└── views/         # 页面组件
    ├── dashboard/ # 仪表盘
    ├── login/     # 登录
    ├── members/   # 团队成员
    ├── projects/  # 项目管理
    └── tasks/     # 任务管理
```

## 后端对接

当前使用 Mock API 模拟数据。对接真实后端时：

1. 修改 `.env` 中的 `VITE_API_BASE_URL` 为后端地址
2. 将 `src/api/index.ts` 中的 Mock 调用替换为 `request()` 真实请求

```typescript
// 示例：替换 Mock 为真实 API
import { request } from '@/utils/request'

export const projectApi = {
  getList: (params: PageParams) => request({ url: '/projects', method: 'get', params }),
}
```
