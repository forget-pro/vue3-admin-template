import type { RouteRecordRaw } from 'vue-router'
import { RouteSceanConfig } from "@/config/setting"
import { generateComponentName } from "@zippybee/plugin-component-name"
import { isEqual } from "lodash-es"
export type ExcludeRule = string | RegExp | ((path: string) => boolean)

export interface AutoRouteOptions {
    exclude?: ExcludeRule[]
}
/**
 * 检查路径是否应该被排除
 * @param path 文件路径，如 '/src/views/login/login.vue'
 * @param rules 排除规则数组，支持字符串匹配、正则匹配、函数判断
 * @returns 如果路径匹配任一规则则返回 true，否则返回 false
 */
const shouldExclude = (path: string, rules?: ExcludeRule[]): boolean => {
    if (!rules?.length) return false

    return rules.some(rule =>
        typeof rule === 'string' ? path.includes(rule) :
            rule instanceof RegExp ? rule.test(path) :
                rule(path)
    )
}

let cachedRoutes: RouteRecordRaw[] | null = null
let cachedOptions: AutoRouteOptions | null = null

/**
 * 自动扫描 views 目录并生成路由配置
 * 
 * 功能说明：
 * - 自动扫描 @/views 目录下所有符合规范的 .vue 文件
 * - 使用懒加载模式，实现代码分割和按需加载
 * - 支持排除规则，灵活控制哪些文件不参与自动路由生成
 * 
 * @param options 配置项
 * @param options.exclude 排除规则数组，支持：
 *   - 字符串：路径包含该字符串则排除，如 '/login'
 *   - 正则：路径匹配该正则则排除，如 /\/admin\//
 *   - 函数：自定义判断逻辑，如 (path) => path.includes('_temp')
 * 
 * @returns 路由配置数组
 */
export function generateAutoRoutes(options?: AutoRouteOptions): RouteRecordRaw[] {
    const modules = import.meta.glob('@/views/**/*.{vue,tsx}')
    const routes: RouteRecordRaw[] = []

    for (const [path, loader] of Object.entries(modules)) {
        if (shouldExclude(path, options?.exclude)) continue
        const routerinfo = generateComponentName(path, RouteSceanConfig)
        if (routerinfo) {
            routes.push({
                name: routerinfo.routeName,
                path: routerinfo.routePath,
                component: loader,
                meta: { title: routerinfo.routeName },
            })
        }
        // const route = parseRoute(path, loader)
        // if (route) routes.push(route)
    }

    if (import.meta.env.DEV) {
        console.log(`[Auto Route] ✅ 注册 ${routes.length} 个路由`)
    }

    return routes
}

/**
 * 获取自动生成的路由配置（单例模式，带缓存）
 * 
 * 功能说明：
 * 
 * @param options 配置项（同 generateAutoRoutes）
 * @param options.exclude 排除规则数组
 * @returns 路由配置数组
 */
export const getAutoRoutes = (options?: AutoRouteOptions): RouteRecordRaw[] => {
    const optionsChanged = !isEqual(options, cachedOptions)

    if (!cachedRoutes || optionsChanged) {
        cachedRoutes = generateAutoRoutes(options)
        cachedOptions = options ?? null
    }

    return cachedRoutes
}

/**
 * 清除路由缓存
 * 
 * 使用场景：
 * - 热更新时需要重新扫描路由
 * - 动态添加/删除路由文件后需要刷新
 * - 测试环境需要重置路由状态
 */
export const clearRouteCache = (): void => {
    cachedRoutes = null
}

/**
 * 扫描菜单文件夹 生成菜单树并排序
 */
export const generateMenuTree = (): MenuConfigItem[] => {
    const modules = import.meta.glob<MenuConfigOption>(['./menu/*.ts', '!./menu/**/*.d.ts'], { eager: true, import: 'default' })
    // 按 order 排序后提取所有 menu 字段并合并
    const sortedModules = Object.values(modules).sort((a, b) => {
        const orderA = a?.order ?? 999
        const orderB = b?.order ?? 999
        return orderA - orderB
    })

    return sortedModules.flatMap(module => module?.menu ?? [])
}

/**
 * 将菜单树拍平为 key-value 对象（递归展开所有 children）
 * @param menuTree 菜单树数组
 * @returns 以 key 为键的菜单对象映射（不含 children 字段）
 */
export const flattenMenuTree = (menuTree: MenuConfigItem[]): Record<string, Omit<MenuConfigItem, 'children'>> => {
    const result: Record<string, Omit<MenuConfigItem, 'children'>> = {}

    for (const item of menuTree) {
        const { children, ...itemWithoutChildren } = item
        result[item.key] = itemWithoutChildren

        if (children?.length) {
            Object.assign(result, flattenMenuTree(children))
        }
    }

    return result
}