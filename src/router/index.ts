import { createRouter, createWebHistory } from "vue-router";
import { commonRouter } from "./common"
import { createRouterGuard } from "./guard"
import type { App } from 'vue'

// 导出 router 实例，供其他模块使用
export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: commonRouter
})

export async function setupRouter(app: App) {
    app.use(router);
    await createRouterGuard(router);
    await router.isReady()
}