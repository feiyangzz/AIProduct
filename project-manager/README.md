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
- **Mock**: vite-plugin-mock + Mock.js
- **测试**: Vitest + Vue Test Utils

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

# 启动开发服务器（自动启用 Mock API）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 自动化测试

```bash
# 监听模式运行测试
npm test

# 单次运行全部测试
npm run test:run

# 运行测试并生成覆盖率报告
npm run test:coverage
```

测试覆盖范围：

| 类别 | 文件 | 说明 |
|------|------|------|
| Mock 接口 | `tests/mock/*.test.ts` | 认证、项目、任务、仪表盘 handler |
| Store | `tests/stores/*.test.ts` | Pinia 状态逻辑 |
| 组件 | `tests/views/*.test.ts` | 登录页渲染与交互 |
| 常量 | `tests/constants.test.ts` | 状态/优先级映射 |

## 演示账号

| 用户名 | 密码   |
|--------|--------|
| admin  | 123456 |

## 项目结构

```
project-manager/
├── mock/                  # vite-plugin-mock 接口定义
│   ├── handlers/          # 可独立测试的业务 handler
│   ├── db.ts              # Mock.js 驱动的内存数据库
│   ├── utils.ts           # 统一响应封装
│   └── index.ts           # Mock 路由注册
├── tests/                 # Vitest 自动化测试
├── src/
│   ├── api/               # Axios API 层（对接 /api/*）
│   ├── constants/         # 常量与枚举映射
│   ├── layouts/           # 布局组件
│   ├── router/            # 路由配置
│   ├── stores/            # Pinia 状态管理
│   ├── styles/            # 全局样式
│   ├── test/              # 测试 setup（global mock）
│   ├── types/             # TypeScript 类型定义
│   ├── utils/             # 工具函数（Axios 封装）
│   └── views/             # 页面组件
└── vitest.config.ts       # Vitest 配置
```

## Mock 说明

开发模式下 `vite-plugin-mock` 自动拦截 `/api/*` 请求：

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/login` | 登录 |
| POST | `/api/auth/logout` | 退出 |
| GET | `/api/auth/me` | 当前用户 |
| GET/POST/PUT/DELETE | `/api/projects` | 项目 CRUD |
| GET/POST/PUT/DELETE | `/api/tasks` | 任务 CRUD |
| GET | `/api/team/members` | 团队成员 |
| GET | `/api/dashboard/stats` | 仪表盘统计 |

Mock 数据使用 **Mock.js** 生成头像等随机数据，业务 handler 可直接被 Vitest 单元测试调用，无需启动 HTTP 服务。

接入真实后端时，关闭 Mock 插件并将 `VITE_API_BASE_URL` 指向真实 API 地址即可。
