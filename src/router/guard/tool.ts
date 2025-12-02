import { useRouteStore } from '@/store/router';
import type { VNodeChild } from 'vue'
// 简化的菜单选项类型（避免类型实例化过深）
export interface SimpleMenuOption {
    label: string
    key: string
    icon?: () => VNodeChild
    children?: SimpleMenuOption[]
}
/**
 * 存储 token 的键名
 */
const TOKEN_KEY = 'token';

/**
 * 检查用户是否已登录
 * @returns 是否已登录
 */
export const isLogin = (): boolean => {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        return Boolean(token && token.trim());
    } catch (error) {
        console.error('检查登录状态失败:', error);
        return false;
    }
};

/**
 * 处理根路径重定向逻辑
 * @param path 目标路径
 * @returns 重定向路径或 null
 */
export const handleRootRedirect = (path: string, routerStore: ReturnType<typeof useRouteStore>): string | null => {
    // 仅处理根路径
    if (path !== '/') return null;

    // 未登录重定向到登录页
    if (!isLogin()) {
        return '/login';
    }
    // 已登录用户的根路径重定向
    return routerStore.firstMenuOption?.key
};