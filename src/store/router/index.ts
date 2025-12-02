import { routerStoreKey } from '@/store/constant'
import { router } from '@/router'
import { defineStore } from 'pinia'
import { getUserMenu } from "@/api/user"
import type { RouteRecordRaw } from 'vue-router'
import { transformMenuTree } from './tool'
import type { MenuOption } from 'naive-ui'


export const useRouteStore = defineStore(routerStoreKey, {
    state: (): IRouteState => ({
        isInitAuthRoute: false,  // 不缓存：每次刷新页面都需要重新注册路由
        removeRoutes: [],
        menus: [], // 后端返回的原始菜单数据
        refreshRoute: true, // 是否刷新路由
        menuTreeOption: [], // 本地完整的菜单树配置
        menuOptions: [], // 用于菜单显示的数据（不含 meta
        flattenMenus: {},// 扁平化后的菜单数据
        breadcrumbList: [],
        enableBackendAuthRoute: true, // 开启后端鉴权路由
        firstMenuOption: null, // 第一个菜单对象
        keepAlive: [], //需要缓存的路由
        maxCancheNum: 10 // 最大缓存路由数
    }),
    actions: {
        setInitAuthRoute(status: boolean) {
            this.isInitAuthRoute = status
        },
        setState<K extends keyof IRouteState>(playload: Record<K, IRouteState[K]>) {
            this.$patch({ ...playload })
        },

        // 获取远程菜单
        async onRemoteMenus() {
            if (this.enableBackendAuthRoute) {
                const menuList = await getUserMenu()
                this.menus = menuList
            }
        },

        // 获取远程菜单并转换路由（一次性完成权限过滤、菜单生成、路由转换）
        initAuthRoute() {
            // 标记路由已开始初始化（防止重复调用）
            this.setInitAuthRoute(true)

            // 如果没有本地菜单配置，直接返回
            if (!this.menuTreeOption.length) {
                return []
            }
            // 根据是否启用后端权限路由，传入不同的参数
            // enableBackendAuthRoute = true: 传入后端菜单进行权限过滤
            // enableBackendAuthRoute = false: 传入空数组，直接转换本地菜单
            const menuList = this.enableBackendAuthRoute ? this.menus : []

            // 后端权限模式下，需要检查后端菜单数据
            if (this.enableBackendAuthRoute && !menuList.length) {
                console.warn('后端权限路由已启用，但未获取到后端菜单数据')
                return []
            }

            // 统一使用 transformMenuTree 处理
            const { menuOptions, routes, flattenMenus } = transformMenuTree(this.menuTreeOption, menuList)

            // 更新状态
            this.menuOptions = menuOptions
            this.flattenMenus = flattenMenus

            // 注册路由到 Vue Router
            this.handleRoutetoVueRouter(routes)
            // 获取第一个可访问的菜单路由
            this.getFirstMenuRoute()
            return routes
        },
        // 获取第一个可访问的菜单路由（递归查找最深的第一个叶子节点）
        getFirstMenuRoute(): MenuOption | null {
            if (!this.menuOptions.length) return null
            // 递归查找第一个叶子节点
            const findFirstLeaf = (menu: MenuOption): MenuOption | null => {
                // 如果有子菜单，继续递归
                if (menu.children?.length) {
                    return findFirstLeaf(menu.children[0] as MenuOption)
                }
                // 找到叶子节点，返回 key
                return menu || null
            }
            this.firstMenuOption = findFirstLeaf(this.menuOptions[0])
            return this.firstMenuOption
        },
        // 将路由添加到Router实例
        handleRoutetoVueRouter(routers: RouteRecordRaw[]) {
            for (const route of routers) {
                const removeRoute = router.addRoute(route)
                this.removeRoutes.push(removeRoute)
            }
        },
        // 根据菜单的key获取菜单的链路（从根节点到目标节点的完整路径）
        getMenuPathByKey(key: string): MenuOption[] | null {
            if (!this.menuOptions.length) return null

            const result: MenuOption[] = []

            // 深度优先搜索（DFS）+ 提前返回优化
            function dfs(items: MenuOption[], trail: MenuOption[]): boolean {
                for (const item of items) {
                    const newTrail = [...trail, item]

                    // 找到目标菜单
                    if (item.key === key) {
                        result.push(...newTrail)
                        return true // 找到后立即返回，停止搜索
                    }
                    // 递归搜索子菜单
                    if (item.children && dfs(item.children as MenuOption[], newTrail)) {
                        return true // 子树找到了，向上返回
                    }
                }
                return false // 当前分支未找到
            }

            dfs(this.menuOptions, [])
            return result.length > 0 ? result : null
        },
        // 添加路由缓存
        addKeepAlive(routeName: string) {

            if (!this.keepAlive.includes(routeName)) {
                this.keepAlive.push(routeName)
            }
            if (this.keepAlive.length >= this.maxCancheNum) {
                this.keepAlive.shift() // 超过最大缓存数，移除最早添加的路由
            }
        },
        // 移除路由缓存
        removeKeepAlive(routeName: string) {
            const index = this.keepAlive.indexOf(routeName)
            if (index !== -1) {
                this.keepAlive.splice(index, 1)
            }
        }

    }
})