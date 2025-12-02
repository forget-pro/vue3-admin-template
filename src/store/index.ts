import { createPinia } from 'pinia'
import { useRouteStore } from "./router"
import { useLayoutTabStore } from "./layout-tab"
import { createPersistedState } from 'pinia-plugin-persistedstate'

// 持久化插件配置：不自动持久化所有 store，由各 store 自行配置
const persist = createPersistedState({
    storage: localStorage,
    auto: false,  // 关键：不自动持久化，需要 store 显式启用
})

export const store = createPinia().use(persist)

export default function useStore() {
    return {
        useRouteStore: useRouteStore(),
        useLayoutTabStore: useLayoutTabStore(),
    }
}