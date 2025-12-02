import { layoutTabStoreKey } from "../constant"
import { defineStore } from 'pinia'
import { useRouteStore } from "../router"
import { isEqual } from "lodash-es"


export const useLayoutTabStore = defineStore(layoutTabStoreKey, {
    state: (): LayoutTabState => ({
        tabs: [],
    }),
    persist: true,

    getters: {
        // 获取 routeStore 实例（复用）
        routeStore: () => useRouteStore(),

        // 获取标签索引
        getTabIndex: (state) => (key: string) => {
            return state.tabs.findIndex((item) => item.key === key)
        },

        // 获取第一个菜单key（白名单路由）
        getFirstMenuKey(): string | undefined {
            return this.routeStore.firstMenuOption?.key
        },
    },

    actions: {
        setState<K extends keyof LayoutTabState>(playload: Record<K, LayoutTabState[K]>) {
            this.$patch({ ...playload })
        },

        /**
         * 判断当前激活标签是否在清除范围内，并返回需要跳转的key
         * @param currentRoute 当前路由key
         * @param targetKey 操作的标签key
         * @param isInClearRange 判断是否在清除范围内的函数
         * @returns 如果当前激活标签在清除范围内，返回targetKey，否则返回null
         */
        _shouldNavigateAfterClear(currentRoute: string, targetKey: string, isInClearRange: (currentIndex: number, targetIndex: number) => boolean): string | null {
            const currentIndex = this.getTabIndex(currentRoute)
            const targetIndex = this.getTabIndex(targetKey)

            if (currentIndex === -1 || targetIndex === -1) return null

            return isInClearRange(currentIndex, targetIndex) ? targetKey : null
        },

        /**
         * 清除指定 tabs 的 keepAlive 缓存
         * @param tabs 需要清除缓存的 tab 数组
         */
        _clearKeepAliveCache(tabs: LayoutTabItem[]) {
            tabs.forEach(tab => {
                if (tab.name) {
                    this.routeStore.removeKeepAlive(tab.name)
                }
            })
        },

        /**
         * 清除单个 tab 的 keepAlive 缓存
         * @param tabName tab 的 name
         */
        _clearSingleKeepAliveCache(tabName: string) {
            if (!tabName) return
            this.routeStore.removeKeepAlive(tabName)
        },

        /**
         * 添加标签页（优化版）
         * 同路径不同参数的路由自动添加序号后缀
         */
        handleAddTab(newTab: LayoutTabItem) {
            // 白名单路由或已存在的完全相同 tab 不添加
            const hasTab = this.tabs.find(item => item.key === newTab.key)
            if (hasTab) {
                // 分离路径与 query（query 可能为 undefined）
                const [routePathRaw, query] = String(newTab.key).split('?')
                const routePath = routePathRaw ?? ''
                const routeTab = this.routeStore.flattenMenus[routePath]
                // routeTab 不存在则不做任何更新
                if (!routeTab) return
                // 生成新的 key（保留 query 部分如果存在）
                const newKey = `${routeTab.key}${query ? '?' + query : ''}`
                const tabChangeObj = {
                    title: routeTab.label || hasTab.title,
                    icon: routeTab.icon || hasTab.icon,
                    name: newTab.name ?? hasTab.name,
                    key: newKey,
                }
                if (!isEqual(hasTab, tabChangeObj)) {
                    Object.assign(hasTab, tabChangeObj)
                }
                return
            }

            // 查找同路径 tabs 并提取最大序号（一次遍历完成）
            const baseKey = newTab.key.split('?')[0]
            let maxNumber = 0

            for (const tab of this.tabs) {
                if (tab.key.split('?')[0] === baseKey) {
                    const match = tab.title.match(/-(\d+)$/)
                    if (match) {
                        const num = parseInt(match[1] || '0')
                        if (num > maxNumber) maxNumber = num
                    }
                }
            }

            // 存在同路径 tab 则添加序号
            if (maxNumber > 0 || this.tabs.some(tab => tab.key.split('?')[0] === baseKey)) {
                newTab.title = `${newTab.title}-${maxNumber + 1}`
            }

            this.tabs.push(newTab)
        },

        // 删除标签页
        handleRemoveTab(key: string, currentRoute: string): string | null {
            if (currentRoute !== key) return null

            const index = this.getTabIndex(key)
            if (index === -1) return null

            // 获取要删除的 tab
            const removedTab = this.tabs[index]

            // 返回右侧或左侧的标签key
            const nextKey = this.tabs[index + 1]?.key || this.tabs[index - 1]?.key || null

            // 删除 tab
            this.tabs.splice(index, 1)

            // 清除对应的 keepAlive 缓存
            if (removedTab) {
                this._clearSingleKeepAliveCache(removedTab.name)
            }

            return nextKey
        },

        // 清除左边标签页
        handleClearLeftTab(key: string, currentRoute: string): string | null {
            const targetIndex = this.getTabIndex(key)
            if (targetIndex <= 0) return null

            // 判断当前激活标签是否在清除范围内（索引在 1 到 targetIndex-1 之间）
            const result = this._shouldNavigateAfterClear(
                currentRoute,
                key,
                (currentIndex, targetIdx) => currentIndex > 0 && currentIndex < targetIdx
            )

            // 获取要删除的 tabs（从第 2 个开始到目标左边）
            const removedTabs = this.tabs.slice(1, targetIndex)

            // 清除这些 tabs 的 keepAlive 缓存
            this._clearKeepAliveCache(removedTabs)

            // 从第 2 个开始删到目标左边（保留第一个）
            this.tabs.splice(1, targetIndex - 1)

            return result
        },

        // 清除右边标签页
        handleClearRightTab(key: string, currentRoute: string): string | null {
            const targetIndex = this.getTabIndex(key)
            if (targetIndex < 0) return null

            // 判断当前激活标签是否在清除范围内（索引大于 targetIndex）
            const result = this._shouldNavigateAfterClear(
                currentRoute,
                key,
                (currentIndex, targetIdx) => currentIndex > targetIdx
            )

            // 获取要删除的 tabs（目标右边的所有）
            const removedTabs = this.tabs.slice(targetIndex + 1)

            // 清除这些 tabs 的 keepAlive 缓存
            this._clearKeepAliveCache(removedTabs)

            // 清除右边的标签页
            this.tabs = this.tabs.slice(0, targetIndex + 1)

            return result
        },

        // 清除其他标签页
        handleClearOtherTab(key: string, currentRoute: string): string | null {
            const firstMenuKey = this.getFirstMenuKey

            // 判断当前激活标签是否会被清除
            const willCurrentBeClear = currentRoute !== key && currentRoute !== firstMenuKey

            // 获取要删除的 tabs（除了第一个菜单和目标标签）
            const removedTabs = this.tabs.filter((item) => {
                return item.key !== firstMenuKey && item.key !== key
            })

            // 清除这些 tabs 的 keepAlive 缓存
            this._clearKeepAliveCache(removedTabs)

            // 过滤保留第一个菜单和目标标签
            this.tabs = this.tabs.filter((item) => {
                return item.key === firstMenuKey || item.key === key
            })

            return willCurrentBeClear ? key : null
        },

        // 清空标签页
        handleClearTab(): string | null {
            const firstMenuKey = this.getFirstMenuKey

            // 获取要删除的 tabs（除了第一个菜单）
            const removedTabs = this.tabs.filter((item) => item.key !== firstMenuKey)

            // 清除这些 tabs 的 keepAlive 缓存
            this._clearKeepAliveCache(removedTabs)

            // 只保留第一个菜单
            this.tabs = this.tabs.filter((item) => item.key === firstMenuKey)

            return firstMenuKey || null
        },
    },
})