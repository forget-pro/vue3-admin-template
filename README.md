# Vue Admin Template

一个基于 Vue 3 + TypeScript + Vite 的现代化后台管理系统模板，具备完善的路由自动化、权限管理、组件自动注册等核心功能。

## 📚 目录

- [技术栈](#-技术栈)
- [核心特性](#-核心特性)
- [快速开始](#-快速开始)
- [项目结构](#-项目结构)
- [核心机制详解](#-核心机制详解)
  - [路由自动注册](#1-路由自动注册机制)
  - [组件自动导入](#2-组件自动导入机制)
  - [菜单权限系统](#3-菜单权限系统)
  - [路由守卫机制](#4-路由守卫机制)
  - [路由缓存机制](#5-路由缓存机制keep-alive)
- [开发指南](#-开发指南)
  - [新增页面](#1️⃣-新增页面)
  - [新增菜单模块](#2️⃣-新增菜单模块)
  - [配置后端权限](#3️⃣-配置后端权限)
  - [使用动态搜索表单](#4️⃣-使用动态搜索表单)
- [配置说明](#-配置说明)

---

## 🚀 技术栈

### 核心框架

- **Vue 3.5** - 渐进式 JavaScript 框架
- **TypeScript 5.9** - JavaScript 的超集，提供类型安全
- **Vite 7.1** - 新一代前端构建工具

### 路由与状态管理

- **Vue Router 4.6** - Vue.js 官方路由管理器
- **Pinia 3.0** - Vue 官方状态管理库
- **pinia-plugin-persistedstate** - Pinia 持久化插件

### UI 框架与样式

- **Naive UI 2.43** - Vue 3 组件库
- **TailwindCSS 4.1** - 原子化 CSS 框架
- **@ant-design/colors** - Ant Design 色彩系统

### 工具库

- **Axios 1.13** - HTTP 请求库
- **@vueuse/core** - Vue Composition 工具集
- **nprogress** - 页面加载进度条
- **BetterScroll** - 移动端滚动解决方案
- **colord** - 颜色处理工具

### 自动化插件

- **unplugin-auto-import** - API 自动导入
- **unplugin-vue-components** - 组件自动注册
- **unplugin-icons** - 图标自动导入
- **@zippybee/plugin-component-name** - 组件名自动注入
- **vite-plugin-svg-icons** - SVG 图标自动导入

### 代码规范

- **ESLint 9.39** - JavaScript/TypeScript 代码检查
- **Prettier 3.6** - 代码格式化工具
- **Husky 9.1** - Git hooks 工具
- **lint-staged** - Git 暂存区文件检查
- **Commitlint 20.1** - Commit 信息规范校验

---

## ✨ 核心特性

### 1. 🔄 路由自动注册

- 基于文件系统的约定式路由
- 自动扫描 `views` 目录生成路由配置
- 支持懒加载和代码分割
- 路由规则完全可配置

### 2. 📦 组件自动导入

- Vue 组件自动注册（无需手动 import）
- Naive UI 组件按需自动导入
- 组件名称自动注入（支持 Vue DevTools 调试）
- 图标组件自动导入

### 3. 🔐 权限管理系统

- 支持前端路由权限和后端动态权限
- 菜单与路由联动
- 灵活的权限过滤机制
- 支持白名单配置

### 4. 🎯 智能路由守卫

- 登录状态检查
- 权限路由初始化
- 404 路由处理
- NProgress 进度条集成

### 5. 💾 路由缓存（Keep-Alive）

- 自动缓存指定路由
- 智能缓存上限控制
- 与 Tab 标签联动
- 支持手动清除缓存

### 6. 📑 多标签页系统

- 动态 Tab 标签管理
- 支持关闭、刷新、关闭其他等操作
- 持久化存储
- 与路由缓存联动

### 7. 🔍 动态搜索表单

- 基于 JSON Schema 配置的动态表单
- 支持多种表单组件类型
- 响应式布局自适应
- 支持表单展开/收起
- 异步数据加载

---

## 🎬 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0（推荐）

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

---

## 📁 项目结构

```
vue-admin-template/
├── src/
│   ├── api/                    # API 接口目录
│   │   ├── request/           # HTTP 请求封装
│   │   │   ├── http.ts       # Axios 实例配置
│   │   │   └── request.d.ts  # 请求类型定义
│   │   └── user/              # 用户相关接口
│   │       ├── index.ts       # 用户 API
│   │       └── user.d.ts      # 用户类型定义
│   │
│   ├── assets/                 # 静态资源
│   │   └── icons/             # SVG 图标
│   │
│   ├── components/             # 全局组件
│   │   ├── app-provider/      # 应用提供者组件
│   │   ├── common-table-header/ # 表格列配置组件
│   │   ├── icon-button/       # 图标按钮
│   │   ├── search-form/       # 搜索表单组件 ⭐核心
│   │   │   ├── search-form.vue # 表单主组件
│   │   │   ├── component.ts   # 组件映射配置
│   │   │   ├── hook.ts        # 组件状态管理
│   │   │   └── async-select.vue # 异步下拉选择器
│   │   ├── slider-verify/     # 滑块验证
│   │   └── svg-icon/          # SVG 图标组件
│   │
│   ├── config/                 # 配置文件
│   │   └── setting.ts         # 路由规则配置
│   │
│   ├── hook/                   # Composition API Hooks
│   │   ├── index.ts           # 导出所有 hooks
│   │   ├── useForm.ts         # 表单处理
│   │   ├── useState.ts        # 状态管理
│   │   └── useTheme.ts        # 主题切换
│   │
│   ├── layouts/                # 布局组件
│   │   ├── index.vue          # 主布局
│   │   ├── hook.ts            # 布局 hooks
│   │   ├── layout-header/     # 头部组件
│   │   ├── layout-sider/      # 侧边栏组件
│   │   └── layout-tab/        # 标签页组件
│   │
│   ├── plugins/                # 插件目录
│   │   ├── loading.ts         # 全局 Loading
│   │   ├── tool.ts            # 工具函数
│   │   └── vite-compoment.ts  # Vite 组件插件
│   │
│   ├── router/                 # 路由配置 ⭐核心
│   │   ├── index.ts           # 路由实例
│   │   ├── transfrom.ts       # 路由转换器（自动注册核心）
│   │   ├── common/            # 公共路由（登录、404）
│   │   ├── guard/             # 路由守卫
│   │   │   ├── index.ts       # 守卫主逻辑
│   │   │   └── tool.ts        # 守卫工具函数
│   │   └── menu/              # 菜单配置 ⭐核心
│   │       ├── dashboard.ts   # 示例菜单
│   │       └── menu.d.ts      # 菜单类型定义
│   │
│   ├── store/                  # Pinia 状态管理
│   │   ├── index.ts           # Store 导出
│   │   ├── constant.ts        # Store 常量
│   │   ├── layout-tab/        # 标签页状态
│   │   └── router/            # 路由状态 ⭐核心
│   │       ├── index.ts       # 路由 Store
│   │       ├── router.d.ts    # 路由类型定义
│   │       └── tool.ts        # 路由工具函数
│   │
│   ├── utils/                  # 工具函数
│   │   └── tool.ts
│   │
│   ├── views/                  # 页面视图 ⭐核心
│   │   ├── dashboard/         # 仪表盘模块
│   │   │   ├── console/       # 主控台
│   │   │   ├── monitoring/    # 监控页
│   │   │   └── order-data/    # 订单数据
│   │   ├── home/              # 首页
│   │   ├── login/             # 登录页
│   │   ├── not-found/         # 404 页面
│   │   └── tsx-demo/          # TSX 示例
│   │
│   ├── App.vue                 # 根组件
│   ├── main.ts                 # 应用入口
│   └── style.css               # 全局样式
│
├── types/                      # 类型声明文件
│   ├── auto-imports.d.ts      # 自动导入类型
│   ├── components.d.ts        # 组件类型
│   └── icons.d.ts             # 图标类型
│
├── tailwindcss/                # TailwindCSS 配置
│   └── generate.js            # CSS 生成脚本
│
├── vite.config.ts              # Vite 配置
├── tsconfig.json               # TypeScript 配置
├── eslint.config.ts            # ESLint 配置
├── prettier.config.js          # Prettier 配置
├── tailwind.config.js          # Tailwind 配置
└── package.json                # 项目依赖
```

---

## 🔍 核心机制详解

### 1. 路由自动注册机制

#### 📌 工作原理

路由自动注册基于 **Vite 的 `import.meta.glob`** API 和 **约定式路由规则**，自动扫描 `views` 目录生成路由配置。

#### 🔧 核心配置

**配置文件：`src/config/setting.ts`**

```typescript
export const RouteSceanConfig = {
  VIEW_PATH_PATTERN: /\/views\/(.+)\.(vue|tsx)$/, // 匹配路径规则
  PATH_SEPARATOR: '/', // 路径分隔符
  MIN_DEPTH: 2, // 最小路径深度
  MAX_DEPTH: 3, // 最大路径深度
}
```

#### 📖 路由生成规则

**核心逻辑：`src/router/transfrom.ts`**

```typescript
export function generateAutoRoutes(options?: AutoRouteOptions): RouteRecordRaw[] {
  // 1. 使用 Vite 的 glob 扫描所有视图文件
  const modules = import.meta.glob('@/views/**/*.{vue,tsx}')
  const routes: RouteRecordRaw[] = []

  for (const [path, loader] of Object.entries(modules)) {
    // 2. 检查是否需要排除
    if (shouldExclude(path, options?.exclude)) continue

    // 3. 使用 @zippybee/plugin-component-name 生成路由信息
    const routerinfo = generateComponentName(path, RouteSceanConfig)

    if (routerinfo) {
      routes.push({
        name: routerinfo.routeName, // 路由名称
        path: routerinfo.routePath, // 路由路径
        component: loader, // 懒加载组件
        meta: { title: routerinfo.routeName },
      })
    }
  }

  return routes
}
```

#### 🎯 路径映射规则

基于 **文件路径** 自动生成 **路由路径** 和 **路由名称**：

| 文件路径                                    | 路由路径                | 路由名称              | 说明     |
| ------------------------------------------- | ----------------------- | --------------------- | -------- |
| `views/home/home.vue`                       | `/home`                 | `Home`                | 一级路由 |
| `views/dashboard/console/console.vue`       | `/dashboard/console`    | `DashboardConsole`    | 二级路由 |
| `views/dashboard/monitoring/monitoring.vue` | `/dashboard/monitoring` | `DashboardMonitoring` | 二级路由 |
| `views/dashboard/order-data/order-data.vue` | `/dashboard/order-data` | `DashboardOrderData`  | 三级路由 |
| `views/tsx-demo/tsx-demo.tsx`               | `/tsx-demo`             | `TsxDemo`             | 支持 TSX |

#### ⚙️ 命名规则

**规则：**

1. **文件夹名** 转换为 **路由路径**（kebab-case）
2. **文件夹名** 转换为 **路由名称**（PascalCase）
3. 路径深度：`MIN_DEPTH(2)` 到 `MAX_DEPTH(3)` 层

**示例：**

```
views/dashboard/console/console.vue
  ↓
路径: /dashboard/console
名称: DashboardConsole
```

#### 🚫 排除规则

```typescript
// 使用方式
const routes = getAutoRoutes({
  exclude: [
    'not-found', // 字符串匹配
    'login', // 排除登录页
    /\/admin\//, // 正则匹配
    (path) => path.includes('_temp'), // 自定义函数
  ],
})
```

---

### 2. 组件自动导入机制

#### 📦 自动注册的内容

项目使用多个 **unplugin** 插件实现完全自动化：

**配置文件：`vite.config.ts`**

```typescript
export default defineConfig({
  plugins: [
    // 1. 组件名称自动注入（用于 Vue DevTools 调试）
    zippyInjectComponetName(RouteSceanConfig),

    // 2. Vue API 自动导入（ref, computed, watch 等）
    autoImportApi({
      dts: './types/auto-imports.d.ts',
      imports: [
        'vue',
        'vue-router',
        {
          'naive-ui': ['useMessage', 'useDialog', 'useNotification', 'useLoadingBar'],
        },
      ],
    }),

    // 3. 组件自动注册（无需手动 import）
    autoInjectComponents({
      dts: './types/components.d.ts',
      resolvers: [NaiveUiResolver()], // Naive UI 按需导入
    }),

    // 4. SVG 图标自动导入
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets')],
      symbolId: 'icon-[dir]-[name]',
    }),

    // 5. Iconify 图标自动导入
    Icons({ autoInstall: true }),
  ],
})
```

#### 🎨 组件名称自动注入

**核心插件：`@zippybee/plugin-component-name`**

**作用：**

- 自动为 Vue 组件添加 `name` 属性
- 支持 `<script setup>` 和 `defineComponent` 两种写法
- 用于 Vue DevTools 调试和 Keep-Alive 缓存

**示例：**

```vue
<!-- 原始代码 -->
<script setup lang="ts">
const count = ref(0)
</script>

<!-- 编译后自动添加 -->
<script setup lang="ts">
const count = ref(0)

defineOptions({ name: 'DashboardConsole' }) // ← 自动注入
</script>
```

**命名规则：**

- 根据 **文件路径** 自动生成组件名（PascalCase）
- 与路由名称保持一致

#### 📚 API 自动导入

**无需手动 import，直接使用：**

```vue
<script setup lang="ts">
// ❌ 不需要这样写
// import { ref, computed, watch } from 'vue'
// import { useRouter, useRoute } from 'vue-router'

// ✅ 直接使用
const count = ref(0)
const double = computed(() => count.value * 2)
const router = useRouter()
const route = useRoute()

// Naive UI Hooks 也自动导入
const message = useMessage()
const dialog = useDialog()
</script>
```

**生成的类型文件：`types/auto-imports.d.ts`**

#### 🧩 组件自动注册

**无需手动注册，直接使用：**

```vue
<template>
  <!-- ✅ 自动识别并导入 -->
  <BestScroll>
    <NButton @click="handleClick">点击</NButton>
    <SvgIcon name="icon-menu" />
  </BestScroll>
</template>

<script setup lang="ts">
// ❌ 不需要这样写
// import BestScroll from '@/components/best-scroll/best-scroll.vue'
// import { NButton } from 'naive-ui'
</script>
```

**支持的组件：**

1. `src/components` 下的所有组件
2. Naive UI 组件（按需导入）
3. Iconify 图标组件

**生成的类型文件：`types/components.d.ts`**

---

### 3. 菜单权限系统

#### 🗂️ 菜单配置文件

**位置：`src/router/menu/`**

菜单配置采用 **模块化设计**，支持多个配置文件自动合并。

**示例：`src/router/menu/dashboard.ts`**

```typescript
export const MenuConfigOption: MenuConfigOption = {
  order: 0, // 菜单排序权重（数字越小越靠前）
  menu: [
    {
      key: '/home', // 路由路径（必须与 views 目录对应）
      icon: '', // 图标（可选）
      label: '首页', // 菜单显示名称
      meta: {
        auth: true, // 是否需要权限（白名单）
        keepAlive: true, // 是否开启缓存
      },
    },
    {
      key: '/dashboard',
      icon: '',
      label: '仪表盘',
      children: [
        // 子菜单
        {
          label: '主控台',
          icon: '',
          key: '/dashboard/console',
          meta: {
            keepAlive: true,
          },
        },
        {
          label: '监控页',
          icon: '',
          key: '/dashboard/monitoring',
          meta: {
            keepAlive: true,
          },
        },
      ],
    },
  ],
}

export default MenuConfigOption
```

#### 📐 菜单配置规则

| 字段             | 类型               | 必填 | 说明                               |
| ---------------- | ------------------ | ---- | ---------------------------------- |
| `key`            | `string`           | ✅   | 路由路径，必须与 `views` 目录对应  |
| `label`          | `string`           | ✅   | 菜单显示名称                       |
| `icon`           | `string`           | ❌   | 图标名称（支持 Iconify）           |
| `children`       | `MenuConfigItem[]` | ❌   | 子菜单数组                         |
| `meta.auth`      | `boolean`          | ❌   | 是否白名单路由（不受后端权限控制） |
| `meta.keepAlive` | `boolean`          | ❌   | 是否开启路由缓存                   |
| `order`          | `number`           | ❌   | 菜单排序权重                       |

#### 🔐 权限控制模式

**1️⃣ 前端权限模式（默认开启）**

```typescript
// src/store/router/index.ts
enableBackendAuthRoute: true // 开启后端鉴权路由
```

**工作流程：**

1. 应用启动时从后端获取用户菜单权限（`getUserMenu()` API）
2. 将本地菜单配置与后端权限数据进行匹配
3. 只注册用户有权限的路由
4. 无权限的菜单不显示，路由无法访问

**2️⃣ 纯前端模式（关闭后端权限）**

```typescript
enableBackendAuthRoute: false // 关闭后端鉴权
```

**工作流程：**

1. 直接使用本地菜单配置
2. 所有配置的路由都会注册
3. 不进行权限过滤

#### 🎯 权限匹配机制

**核心逻辑：`src/store/router/tool.ts`**

```typescript
// 权限检查逻辑
if (enableBackendAuth) {
    const isWhitelist = menuItem.meta?.auth === true        // 白名单路由
    const hasOwnPermission = backendMenuMap.has(menuItem.key)  // 后端有权限
    const hasChildPermission = childResults.length > 0      // 子级有权限

    // 三个条件满足其一即可显示
    if (!isWhitelist && !hasOwnPermission && !hasChildPermission) {
        return null  // 过滤掉无权限的菜单
    }
}
```

**权限判断规则：**

1. **白名单路由**（`meta.auth: true`）：无论后端是否返回都显示
2. **后端有权限**：后端返回的菜单数据中包含该路由
3. **子级有权限**：即使父级无权限，只要子级有权限就显示父级

#### 📡 后端菜单数据格式

**API：`/getmeun`**

```typescript
// 后端返回数据格式
interface MenuResponse {
  name: string // 菜单名称
  url: string // 路由路径（对应 key）
  icon: string // 图标
  children?: MenuChildren[] // 子菜单
}

// 示例
;[
  {
    'name': '仪表盘',
    'url': '/dashboard',
    'icon': 'dashboard-icon',
    'children': [
      {
        'name': '主控台',
        'url': '/dashboard/console',
        'icon': '',
      },
    ],
  },
]
```

#### 🔄 菜单与路由的转换流程

**核心函数：`transformMenuTree()`**

```typescript
// 1. 创建后端菜单 Map（快速查找）
const backendMenuMap = createMenuMap(menuList)

// 2. 获取自动生成的路由
const autoRoutes = getAutoRoutes({ exclude: ['not-found', 'login'] })
const routeMap = new Map(autoRoutes.map(route => [route.path, route]))

// 3. 递归处理菜单树
const processedMenus = processMenuTree(menuTreeOption, backendMenuMap, enableBackendAuth)

// 4. 生成 Naive UI 菜单选项
const menuOptions = processedMenus.map(item => item.menuOption)

// 5. 生成 Vue Router 路由配置
const routes = generateRoutes(processedMenus, routeMap)

return { menuOptions, routes, flattenMenus }
```

**转换结果：**

1. **menuOptions**: Naive UI 菜单组件使用的数据
2. **routes**: Vue Router 路由配置（嵌套布局）
3. **flattenMenus**: 扁平化的菜单数据（用于面包屑、Tab 等）

---

### 4. 路由守卫机制

#### 🛡️ 守卫流程

**核心文件：`src/router/guard/index.ts`**

```typescript
router.beforeEach(async (to, from, next) => {
  nprogressRef.start() // 1. 启动进度条

  // 2. 添加路由缓存
  if (to.meta?.keepAlive) {
    routeStore.addKeepAlive(to.name as string)
  }

  // 3. 白名单路由直接放行
  if (WHITE_LIST.includes(to.path)) {
    next()
    return
  }

  // 4. 处理根路径重定向
  const rootRedirect = handleRootRedirect(to.path, routeStore)
  if (rootRedirect) {
    next({ path: rootRedirect, query: to.query, replace: true })
    return
  }

  // 5. 检查登录状态
  if (!isLogin()) {
    redirectToLogin(to, next)
    return
  }

  // 6. 已登录用户：处理权限路由初始化
  if (!routeStore.isInitAuthRoute) {
    await initializeAuthRoute(routeStore)

    // 首次初始化：添加首页 Tab
    layoutTabStore.handleAddTab({
      icon: (routeStore.firstMenuOption?.icon as string) || '',
      key: routeInfo?.path as string,
      title: routeStore.firstMenuOption?.label as string,
      name: routeInfo?.name as string,
    })

    // 404 路由重新跳转（动态路由注册后）
    if (to.name === 'not-found') {
      next({ path: to.path, query: to.query, replace: true })
      return
    }
  }

  // 7. 正常放行
  next()
})

router.afterEach((to) => {
  // 8. 添加 Tab 标签
  layoutTabStore.handleAddTab({
    icon: (to.meta.icon as string) || '',
    key: to.fullPath,
    title: to.meta.title as string,
    name: to.name as string,
  })

  nprogressRef.done() // 9. 完成进度条
})
```

#### 🔑 登录状态检查

**工具函数：`src/router/guard/tool.ts`**

```typescript
const TOKEN_KEY = 'token'

export const isLogin = (): boolean => {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    return Boolean(token && token.trim())
  } catch (error) {
    console.error('检查登录状态失败:', error)
    return false
  }
}
```

**未登录处理：**

```typescript
const redirectToLogin = (to, next) => {
  next({
    name: 'Login',
    query: { redirect: to.fullPath }, // 保存目标路径
    replace: true,
  })
}
```

#### 🏠 根路径重定向

```typescript
export const handleRootRedirect = (path, routerStore) => {
  if (path !== '/') return null

  // 未登录 → 登录页
  if (!isLogin()) {
    return '/login'
  }

  // 已登录 → 首个菜单路由
  return routerStore.firstMenuOption?.key
}
```

#### 🚀 权限路由初始化

```typescript
const initializeAuthRoute = async (routerStore) => {
  try {
    // 1. 获取后端菜单（如果为空）
    if (!routerStore.menus?.length) {
      await routerStore.onRemoteMenus() // 调用接口
      routerStore.initAuthRoute() // 初始化路由
    }
    return true
  } catch (error) {
    console.error('初始化权限路由失败:', error)
    return false
  }
}
```

#### 📋 白名单配置

```typescript
/** 白名单路由（不需要登录即可访问） */
const WHITE_LIST = ['/login'] as const
```

#### ⚡ NProgress 配置

```typescript
const NPROGRESS_CONFIG = {
  easing: 'ease',
  speed: 500,
  showSpinner: false,
  minimum: 0.08,
  trickleSpeed: 200,
  parent: 'body',
}
```

---

### 5. 路由缓存机制（Keep-Alive）

#### 💾 缓存原理

项目使用 **Vue 3 Keep-Alive** 组件配合 **组件 name** 实现路由缓存。

**核心实现：`src/layouts/index.vue`**

```vue
<template>
  <keep-alive :include="useRouteStore.keepAlive" :max="10">
    <router-view />
  </keep-alive>
</template>
```

**缓存条件：**

1. 路由 `meta.keepAlive` 为 `true`
2. 组件必须有 `name` 属性（自动注入）
3. 组件 name 在 `keepAlive` 数组中

#### ⚙️ 缓存管理

**Store：`src/store/router/index.ts`**

```typescript
export const useRouteStore = defineStore(routerStoreKey, {
  state: () => ({
    keepAlive: [], // 需要缓存的路由名称数组
    maxCancheNum: 10, // 最大缓存数量
  }),

  actions: {
    // 添加路由缓存
    addKeepAlive(routeName: string) {
      if (!this.keepAlive.includes(routeName)) {
        this.keepAlive.push(routeName)
      }

      // 超过最大缓存数，移除最早添加的
      if (this.keepAlive.length >= this.maxCancheNum) {
        this.keepAlive.shift()
      }
    },

    // 移除路由缓存
    removeKeepAlive(routeName: string) {
      const index = this.keepAlive.indexOf(routeName)
      if (index !== -1) {
        this.keepAlive.splice(index, 1)
      }
    },
  },
})
```

#### 🎯 缓存触发时机

**1. 路由守卫添加缓存**

```typescript
// src/router/guard/index.ts
router.beforeEach(async (to, from, next) => {
  // 根据 meta.keepAlive 自动添加
  if (to.meta?.keepAlive) {
    routeStore.addKeepAlive(to.name as string)
  }

  next()
})
```

**2. Tab 关闭时移除缓存**

```typescript
// src/store/layout-tab/index.ts
handleRemoveTab(key: string) {
    const tab = this.tabs.find(t => t.key === key)

    // 清除 Keep-Alive 缓存
    if (tab?.name) {
        this.routeStore.removeKeepAlive(tab.name)
    }

    this.tabs = this.tabs.filter(t => t.key !== key)
}
```

#### 🔄 缓存策略

**LRU（最近最少使用）策略：**

- 缓存数量达到上限（10个）时
- 自动移除最早添加的缓存
- 保留最近访问的路由

**示例：**

```typescript
// 假设已缓存：[A, B, C, D, E, F, G, H, I, J]（满 10 个）
// 访问新路由 K（需要缓存）
// 结果：[B, C, D, E, F, G, H, I, J, K]（移除 A）
```

#### 📝 配置路由缓存

**在菜单配置中启用：**

```typescript
// src/router/menu/dashboard.ts
{
    key: "/dashboard/console",
    label: "主控台",
    meta: {
        keepAlive: true,  // ← 开启缓存
    }
}
```

#### ⚠️ 注意事项

1. **组件必须有 name**：自动注入插件已处理，无需手动添加
2. **name 必须唯一**：路由名称自动生成，保证唯一性
3. **缓存数量限制**：默认 10 个，可修改 `maxCancheNum`
4. **手动清除缓存**：关闭 Tab 时自动清除，也可手动调用 `removeKeepAlive()`

---

## 📖 开发指南

### 1️⃣ 新增页面

**步骤：**

1. **在 `views` 目录创建文件**

```
src/views/user/profile/profile.vue
```

2. **编写页面代码**

```vue
<template>
  <div>用户资料页</div>
</template>

<script setup lang="ts">
// 组件 name 自动注入为：UserProfile
// 路由 path 自动生成为：/user/profile
// 路由 name 自动生成为：UserProfile
</script>
```

3. **添加菜单配置**

```typescript
// src/router/menu/user.ts
export const MenuConfigOption: MenuConfigOption = {
  order: 1,
  menu: [
    {
      key: '/user/profile',
      label: '用户资料',
      icon: 'user-icon',
      meta: {
        keepAlive: true, // 开启缓存
      },
    },
  ],
}

export default MenuConfigOption
```

4. **完成！路由自动注册，菜单自动显示**

### 2️⃣ 新增菜单模块

**创建新的菜单配置文件：**

```typescript
// src/router/menu/system.ts
export const MenuConfigOption: MenuConfigOption = {
  order: 10, // 排序权重
  menu: [
    {
      key: '/system',
      label: '系统管理',
      children: [
        {
          key: '/system/user',
          label: '用户管理',
        },
        {
          key: '/system/role',
          label: '角色管理',
        },
      ],
    },
  ],
}

export default MenuConfigOption
```

**系统会自动：**

- 扫描 `menu/` 目录下的所有 `.ts` 文件
- 按 `order` 排序
- 合并所有菜单配置

### 3️⃣ 配置后端权限

**1. 后端返回菜单数据**

```json
[
  {
    "name": "用户资料",
    "url": "/user/profile",
    "icon": "user-icon"
  }
]
```

**2. 前端自动匹配并过滤**

系统会：

- 匹配 `url` 与菜单配置的 `key`
- 只注册有权限的路由
- 无权限的菜单不显示

### 4️⃣ 使用动态搜索表单

**SearchForm 组件**基于 **JSON Schema** 配置，支持快速构建复杂的搜索表单。

#### 📌 基础使用

**1. 创建表单配置文件**

```typescript
// src/views/user/search.schema.ts
import type { NaiveSearchSchema } from '@/components/search-form/component'

export const searchSchema: NaiveSearchSchema = [
  {
    key: 'name',
    label: '用户名',
    type: 'input',
    props: {
      placeholder: '请输入用户名',
    },
  },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    props: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
      placeholder: '请选择状态',
    },
  },
  {
    key: 'created_at',
    label: '创建时间',
    type: 'datePicker',
    props: {
      type: 'daterange',
      placeholder: '请选择时间范围',
    },
  },
]
```

**2. 在页面中使用**

```vue
<template>
  <div>
    <search-form :schema="searchSchema" v-model="formData" :collapsed-count="4" @submit="handleSearch" />
  </div>
</template>

<script setup lang="ts">
import { searchSchema } from './search.schema'

const formData = ref({})

const handleSearch = (data: Record<string, any>) => {
  console.log('搜索参数:', data)
  // 调用 API 进行搜索
}
</script>
```

#### 🎯 支持的表单类型

| 类型          | 说明           | 组件           |
| ------------- | -------------- | -------------- |
| `input`       | 文本输入框     | `NInput`       |
| `select`      | 下拉选择器     | `NSelect`      |
| `datePicker`  | 日期选择器     | `NDatePicker`  |
| `number`      | 数字输入框     | `NInputNumber` |
| `timePicker`  | 时间选择器     | `NTimePicker`  |
| `cascader`    | 级联选择器     | `NCascader`    |
| `asyncSelect` | 异步下拉选择器 | 自定义组件     |

#### ⚙️ 组件 Props

| 参数              | 类型                  | 默认值     | 说明                |
| ----------------- | --------------------- | ---------- | ------------------- |
| `schema`          | `NaiveSearchSchema`   | `[]`       | 表单配置数组        |
| `modelValue`      | `Record<string, any>` | `{}`       | 表单数据（v-model） |
| `span`            | `number \| object`    | 响应式配置 | 表单项栅格占比      |
| `collapsedCount`  | `number`              | `4`        | 默认显示字段数      |
| `buttonPlacement` | `'left' \| 'right'`   | `'right'`  | 按钮位置            |

#### 📝 Schema 字段配置

```typescript
interface NaiveSearchField {
  key: string // 字段名（必填）
  label: string // 标签文本（必填）
  type: NaiveFieldType // 表单类型（必填）
  props?: Record<string, any> // 组件 props（可选）
}
```

#### 🔄 异步下拉选择器

```typescript
{
  key: 'department',
  label: '部门',
  type: 'asyncSelect',
  props: {
    placeholder: '请选择部门',
    asyncOptions: async () => {
      // 异步加载数据
      const res = await getDepartmentList()
      return res.data.map(item => ({
        label: item.name,
        value: item.id,
      }))
    }
  },
}
```

#### 📱 响应式布局

```typescript
// 自定义不同屏幕尺寸下的栅格占比
const span = {
  xs: 24, // 超小屏：1列
  s: 12, // 小屏：2列
  m: 12, // 中屏：2列
  l: 8, // 大屏：3列
  xl: 6, // 超大屏：4列
  xxl: 6, // 超超大屏：4列
}
```

#### ✨ 高级特性

**1. 展开/收起功能**

当表单字段超过 `collapsedCount` 时，自动显示展开/收起按钮。

**2. 表单重置**

点击重置按钮，清空所有表单数据。

**3. 提交加载状态**

支持提交时的 loading 状态展示。

**4. 自定义组件 props**

每个字段的 `props` 会直接透传给对应的 Naive UI 组件。

```typescript
{
  key: 'date',
  label: '日期范围',
  type: 'datePicker',
  props: {
    type: 'datetimerange',
    clearable: true,
    'start-placeholder': '开始时间',
    'end-placeholder': '结束时间',
    format: 'yyyy-MM-dd HH:mm:ss',
  },
}
```

### 4️⃣ 使用自动导入

**API 自动导入：**

```vue
<script setup lang="ts">
// ✅ 直接使用，无需 import
const count = ref(0)
const router = useRouter()
const message = useMessage()
</script>
```

**组件自动注册：**

```vue
<template>
  <!-- ✅ 直接使用，无需 import -->
  <NButton>按钮</NButton>
  <BestScroll>内容</BestScroll>
</template>
```

---

## ⚙️ 配置说明

### 路由规则配置

**文件：`src/config/setting.ts`**

```typescript
export const RouteSceanConfig = {
  VIEW_PATH_PATTERN: /\/views\/(.+)\.(vue|tsx)$/, // 匹配规则
  PATH_SEPARATOR: '/', // 路径分隔符
  MIN_DEPTH: 2, // 最小深度
  MAX_DEPTH: 3, // 最大深度
}
```

### 权限模式配置

**文件：`src/store/router/index.ts`**

```typescript
export const useRouteStore = defineStore(routerStoreKey, {
  state: () => ({
    enableBackendAuthRoute: true, // true: 后端权限  false: 纯前端
    maxCancheNum: 10, // 最大缓存数量
  }),
})
```

### 白名单配置

**文件：`src/router/guard/index.ts`**

```typescript
const WHITE_LIST = ['/login'] as const
```

### NProgress 配置

**文件：`src/router/guard/index.ts`**

```typescript
const NPROGRESS_CONFIG = {
  easing: 'ease',
  speed: 500,
  showSpinner: false,
  minimum: 0.08,
  trickleSpeed: 200,
}
```

### Git Hooks 配置

项目使用 **Husky + lint-staged + commitlint** 确保代码质量和提交规范。

#### Lint-staged 配置

**文件：`package.json`**

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,vue}": ["eslint --fix", "prettier --write"],
    "*.{json,md,html,css,scss}": ["prettier --write"]
  }
}
```

**说明：**

- 提交前自动对暂存区的代码文件执行 ESLint 和 Prettier
- 对其他文件执行 Prettier 格式化

#### Commitlint 配置

**文件：`commitlint.config.mjs`**

```javascript
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'docs', // 文档更新
        'style', // 代码格式
        'refactor', // 重构
        'perf', // 性能优化
        'test', // 测试
        'chore', // 构建/工具变动
        'revert', // 回滚
        'build', // 构建系统
        'ci', // CI配置
      ],
    ],
    'subject-empty': [2, 'never'],
    'subject-max-length': [2, 'always', 100],
    'type-case': [2, 'always', 'lower-case'],
    'subject-full-stop': [2, 'never', '.'],
  },
}
```

**Commit 规范示例：**

```bash
# ✅ 正确
git commit -m "feat: 添加用户管理页面"
git commit -m "fix: 修复登录验证问题"
git commit -m "docs: 更新README文档"

# ❌ 错误
git commit -m "添加功能"           # 缺少类型
git commit -m "Feat: 添加功能"     # 类型必须小写
git commit -m "feat: 添加功能."    # 不能以句号结尾
```

#### Husky Hooks

**Pre-commit**（`.husky/pre-commit`）

- 提交前运行 lint-staged
- 自动修复代码格式问题

**Commit-msg**（`.husky/commit-msg`）

- 验证 commit 信息格式
- 不符合规范则拒绝提交

---

## 📚 核心依赖说明

| 依赖                              | 版本   | 说明               |
| --------------------------------- | ------ | ------------------ |
| `@zippybee/plugin-component-name` | 1.0.16 | 组件名自动注入插件 |
| `unplugin-auto-import`            | 20.2.0 | API 自动导入       |
| `unplugin-vue-components`         | 30.0.0 | 组件自动注册       |
| `unplugin-icons`                  | 22.5.0 | 图标自动导入       |
| `vite-plugin-svg-icons`           | 2.0.1  | SVG 图标处理       |

---

## 🎓 最佳实践

### ✅ 推荐做法

1. **遵循约定式路由**：文件路径与路由路径保持一致
2. **合理使用缓存**：只对需要保持状态的页面开启 `keepAlive`
3. **菜单配置模块化**：按业务模块拆分菜单配置文件
4. **利用自动导入**：减少手动 import，提高开发效率
5. **权限配置分离**：菜单配置与权限数据分离，便于维护
6. **规范 Commit 信息**：遵循 Conventional Commits 规范
7. **提交前检查**：确保代码通过 lint-staged 检查

### ❌ 避免做法

1. **不要手动注册路由**：破坏自动化机制
2. **不要在 views 外创建页面组件**：无法自动生成路由
3. **不要修改自动生成的类型文件**：会被覆盖
4. **不要缓存所有页面**：影响性能
5. **不要直接修改 Store 状态**：使用 actions 方法
6. **不要绕过 Git Hooks**：使用 `--no-verify` 跳过检查
7. **不要使用不规范的 commit 信息**：会被拒绝提交

---

## 🐛 常见问题

### 1. 路由没有自动注册？

**检查项：**

- 文件路径是否在 `views/` 目录下
- 文件扩展名是否为 `.vue` 或 `.tsx`
- 路径深度是否符合 `MIN_DEPTH` 和 `MAX_DEPTH`
- 是否被 `exclude` 规则排除

### 2. 菜单不显示？

**检查项：**

- 菜单配置的 `key` 是否与文件路径匹配
- 是否开启后端权限但后端未返回该菜单
- 菜单配置文件是否正确导出

### 3. 组件 name 未生效？

**检查项：**

- `@zippybee/plugin-component-name` 插件是否正确配置
- 组件是否在 `views/` 目录下
- Vite 是否重新编译

### 4. Keep-Alive 不生效？

**检查项：**

- 路由 `meta.keepAlive` 是否为 `true`
- 组件是否有 `name` 属性
- `keepAlive` 数组是否包含组件 name

### 5. SearchForm 异步选择器数据未加载？

**检查项：**

- `asyncOptions` 是否返回 Promise
- 返回的数据格式是否为 `{ label: string, value: any }[]`
- 检查浏览器控制台是否有错误

### 6. SearchForm 表单项不显示？

**检查项：**

- schema 配置的 `type` 是否在支持列表中
- `key` 是否唯一
- `label` 是否设置

---

## 📄 License

MIT

---

## 👥 贡献指南

欢迎提交 Issue 和 Pull Request！

---

**🎉 Happy Coding!**
