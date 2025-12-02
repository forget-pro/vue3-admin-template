import type { MenuOption } from 'naive-ui'
import type { RouteRecordRaw } from 'vue-router'
import type { VNodeChild } from 'vue'
import { h } from 'vue'
import { getAutoRoutes } from "@/router/transfrom"
import { toPascalCase } from "@zippybee/plugin-component-name"
type CMenuOption = {
    iconName?: string
} & MenuOption
export interface MenuRouteResult {
    menuOptions: MenuOption[]
    routes: RouteRecordRaw[]
    flattenMenus: Record<string, Omit<MenuConfigItem, 'children'>>
}

interface ProcessedMenuItem {
    menuOption: CMenuOption
    meta: Record<string, any>
    flatRoutes: Array<{ path: string; label: string; icon: string; iconName?: string, meta: Record<string, any> }>
}

// 渲染图标为 VNode
const renderIcon = (icon: string): (() => VNodeChild) => () => h('span', { class: icon })

// 创建后端菜单 Map - 时间复杂度 O(n)
const createMenuMap = (menuList: MenuResponse[]): Map<string, MenuResponse | MenuChildren> => {
    const map = new Map<string, MenuResponse | MenuChildren>()
    const stack: Array<MenuResponse | MenuChildren> = [...menuList]

    while (stack.length > 0) {
        const menu = stack.pop()!
        map.set(menu.url, menu)
        if (menu.children) stack.push(...menu.children)
    }

    return map
}

// 合并菜单数据（后端优先）
const mergeMenuData = (menuItem: MenuConfigItem, backendMenuMap: Map<string, MenuResponse | MenuChildren>) => {
    const backendMenu = backendMenuMap.get(menuItem.key)
    return {
        label: backendMenu?.name || menuItem.label,
        icon: backendMenu?.icon || menuItem.icon,
        meta: { ...menuItem.meta }
    }
}

// 递归处理菜单树（支持权限过滤）
const processMenuTree = (menuTree: MenuConfigItem[], backendMenuMap: Map<string, MenuResponse | MenuChildren>, enableBackendAuth: boolean): ProcessedMenuItem[] => {
    const processItem = (menuItem: MenuConfigItem): ProcessedMenuItem | null => {
        // 递归处理子菜单
        const childResults = menuItem.children ? processMenuTree(menuItem.children, backendMenuMap, enableBackendAuth) : []

        // 权限检查：本地模式保留全部，后端模式进行过滤
        if (enableBackendAuth) {
            const isWhitelist = menuItem.meta?.auth === true
            const hasOwnPermission = backendMenuMap.has(menuItem.key)
            const hasChildPermission = childResults.length > 0

            if (!isWhitelist && !hasOwnPermission && !hasChildPermission) {
                return null
            }
        }

        const { label, icon, meta } = mergeMenuData(menuItem, backendMenuMap)

        // 收集扁平化路由
        const flatRoutes = childResults.flatMap(child => {
            if (child.flatRoutes.length) {
                return child.flatRoutes
            }
            return [{
                path: child.menuOption.key as string,
                label: child.menuOption.label as string,
                icon,
                iconName: child.menuOption.iconName || undefined,
                meta: child.meta
            }]
        }

        )
        const menuOption: MenuOption = {
            label,
            key: menuItem.key,
            icon: icon ? renderIcon(icon) : undefined,
            iconName: icon || undefined,
            children: childResults.length > 0 ? childResults.map(r => r.menuOption) : undefined
        }

        return { menuOption, meta, flatRoutes }
    }

    return menuTree.map(processItem).filter((r): r is ProcessedMenuItem => r !== null)
}

// 生成路由配置
const generateRoutes = (processedMenus: ProcessedMenuItem[], routeMap: Map<string, RouteRecordRaw>): RouteRecordRaw[] => {
    return processedMenus.map(({ menuOption, flatRoutes, meta }) => {
        // 生成子路由
        let children = flatRoutes
            .map(({ path, label, meta, iconName }) => {
                const route = routeMap.get(path)
                if (!route) return null
                const childPath = route.path.replace(new RegExp(`${menuOption.key || ''}/?`, 'g'), '')
                return {
                    path: childPath,
                    name: route.name || label,
                    component: route.component!,
                    meta: { ...route.meta, ...meta, title: label, icon: iconName }
                } as RouteRecordRaw
            })
            .filter((route): route is RouteRecordRaw => route !== null)
        let parentName = ''
        // 一级菜单：添加默认空路径子路由 
        if (children.length === 0) {
            const route = routeMap.get(menuOption.key as string)
            const notFoundComponent = () => import('@/views/not-found/not-found.vue')
            parentName = toPascalCase(menuOption.key as string + 'Root')
            children = [{
                path: '',
                name: toPascalCase(menuOption.key as string),
                component: route?.component || notFoundComponent,
                meta: {
                    ...route?.meta,
                    ...meta,
                    title: menuOption.label,
                    icon: (menuOption as CMenuOption).iconName || ''
                }
            }]
        }

        return {
            path: menuOption.key as string,
            name: parentName || toPascalCase(menuOption.key as string),
            component: () => import('@/layouts/index.vue'),
            meta: { title: menuOption.label, icon: (menuOption as any).iconName || '' },
            children,
        } as RouteRecordRaw
    })
}

// 生成扁平化菜单 - 递归收集所有节点
export const generateFlattenMenus = (menuTreeOption: MenuConfigItem[], backendMenuMap: Map<string, MenuResponse | MenuChildren>): Record<string, Omit<MenuConfigItem, 'children'>> => {
    const result: Record<string, Omit<MenuConfigItem, 'children'>> = {}
    const flatten = (items: MenuConfigItem[]) => {
        for (const menuItem of items) {
            const { label, icon, meta } = mergeMenuData(menuItem, backendMenuMap)
            result[menuItem.key] = { label, key: menuItem.key, icon, meta }
            if (menuItem.children?.length) flatten(menuItem.children)
        }
    }
    flatten(menuTreeOption)
    return result
}

/**
 * 菜单树转换为路由和菜单选项
 * 时间复杂度: O(m + n + r)
 * - m: 本地菜单配置数
 * - n: 后端菜单数
 * - r: 自动路由数
 * 
 * @param menuTreeOption 本地菜单树配置
 * @param menuList 后端权限菜单列表（可选，为空时不进行权限过滤）
 */
export function transformMenuTree(menuTreeOption: MenuConfigItem[], menuList: MenuResponse[] = []): MenuRouteResult {
    const enableBackendAuth = menuList.length > 0
    // 构建查找表 O(n + r)
    const backendMenuMap = enableBackendAuth ? createMenuMap(menuList) : new Map()
    const autoRoutes = getAutoRoutes({ exclude: ['not-found', 'login'] })
    const routeMap = new Map(autoRoutes.map(route => [route.path, route]))

    // 处理菜单树 O(m)
    const processedMenus = processMenuTree(menuTreeOption, backendMenuMap, enableBackendAuth)

    // 生成结果 O(m)
    const menuOptions = processedMenus.map(item => item.menuOption)

    const routes = generateRoutes(processedMenus, routeMap)
    const flattenMenus = generateFlattenMenus(menuTreeOption, backendMenuMap)

    return { menuOptions, routes, flattenMenus: flattenMenus }
}





