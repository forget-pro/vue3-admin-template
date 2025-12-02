import type { RouteRecordRaw } from 'vue-router'

// 普通路由（初始化时注册）
export const commonRouter: RouteRecordRaw[] = [
    {
        name: 'Login',
        path: '/login',
        component: () => import('@/views/login/login.vue'),
        meta: {
            title: '登录',
        },
    },
    {
        name: 'not-found',
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/not-found/not-found.vue'),
        meta: {
            title: 'Not Found',
        },
    }
]

export const baseRouteNames = commonRouter.map(item => item.name as string)