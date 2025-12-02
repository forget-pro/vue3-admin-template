import type { Router, NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { handleRootRedirect, isLogin } from './tool';
import { baseRouteNames } from "@/router/common"
import { generateMenuTree, flattenMenuTree } from "../transfrom"
import { useRouteStore } from '@/store/router';
import { useLayoutTabStore } from '@/store/layout-tab';
import nprogress from 'nprogress';


// ==================== 常量配置 ====================

/** 白名单路由 (不需要登录即可访问的路由) */
const WHITE_LIST = ['/login'] as const;

/** NProgress 配置选项 */
const NPROGRESS_CONFIG = {
    easing: 'ease' as const,
    speed: 500,
    showSpinner: false,
    minimum: 0.08,
    trickleSpeed: 200,
    parent: 'body' as const,
};

// ==================== 工具函数 ====================

/**
 * 创建并配置 NProgress 实例
 * @returns NProgress 控制对象
 */
const createNprogress = () => {
    nprogress.configure(NPROGRESS_CONFIG);
    return {
        start: () => nprogress.start(),
        done: () => nprogress.done(),
    };
};

/**
 * 处理路由重定向到登录页
 */
const redirectToLogin = (to: RouteLocationNormalized, next: NavigationGuardNext) => {
    next({
        name: 'Login',
        query: { redirect: to.fullPath },
        replace: true,
    });
};

/**
 * 根据路由path 获取路由信息
 */

const getRouteByPath = (router: Router, path: string) => {
    const routes = router.getRoutes();
    return routes.find(route => route.path === path && route.children.length == 0);
}

/**
 * 初始化权限路由
 * @returns 是否初始化成功
 */
const initializeAuthRoute = async (routerStore: ReturnType<typeof useRouteStore>): Promise<boolean> => {
    try {
        // 如果菜单数据为空，先获取菜单 //调用接口 获取权限数据
        if (!routerStore.menus?.length) {
            await routerStore.onRemoteMenus();
            routerStore.initAuthRoute();
        }
        return true;
    } catch (error) {
        console.error('初始化权限路由失败:', error);
        return false;
    }
};

// ==================== 路由守卫 ====================

/**
 * 创建并注册路由守卫
 * @param router Vue Router 实例
 */
export const createRouterGuard = (router: Router) => {
    const nprogressRef = createNprogress();
    const routeStore = useRouteStore();
    const layoutTabStore = useLayoutTabStore()
    const notFoundRouteKey = 'not-found'
    const menuTree = generateMenuTree()
    const flattenMenus = flattenMenuTree(menuTree)
    routeStore.setState({ menuTreeOption: menuTree, flattenMenus })
    // 前置守卫
    router.beforeEach(async (to, _from, next) => {
        // 启动进度条
        nprogressRef.start();
        // 添加路由缓存
        if (to.meta?.keepAlive) {
            routeStore.addKeepAlive(to.name as string)
        }

        // 1. 白名单路由直接放行
        if (WHITE_LIST.includes(to.path as typeof WHITE_LIST[number])) {
            next();
            return;
        }
        // 2. 处理根路径重定向
        const rootRedirect = handleRootRedirect(to.path, routeStore);

        if (rootRedirect) {
            next({ path: rootRedirect, query: to.query, replace: true });
            return;
        }

        // 3. 检查登录状态
        if (!isLogin()) {
            redirectToLogin(to, next);
            return;
        }

        // 4. 已登录用户：处理权限路由初始化
        if (!routeStore.isInitAuthRoute) {
            await initializeAuthRoute(routeStore);
            const routeInfo = getRouteByPath(router, routeStore.firstMenuOption.key)
            // 初始化完成后，重新导航到目标路由ß
            layoutTabStore.handleAddTab({
                icon: routeStore.firstMenuOption?.icon as string || '',
                key: routeInfo?.path as string,
                title: routeStore.firstMenuOption?.label as string,
                name: routeInfo?.name as string,
            })

            if (to.name === notFoundRouteKey) {
                next({ path: to.path, query: to.query, replace: true }) //未注册动态路由前404 注册后重新跳转一次
                return
            }
            next()
            return
        }
        // 5. 正常放行
        next();
    });

    // 后置守卫
    router.afterEach((form) => {
        const layoutTabStore = useLayoutTabStore()
        if (!baseRouteNames.includes(form.name as string)) {
            layoutTabStore.handleAddTab({
                icon: form.meta.icon as string || '',
                key: form.fullPath as string,
                title: form.meta.title as string,
                name: form.name as string,
            })
        }

        nprogressRef.done();


    });

    // 错误处理
    router.onError((error) => {
        console.error('路由错误:', error);
        nprogressRef.done();
    });
};