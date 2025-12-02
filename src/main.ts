import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { store } from '@/store'
// @ts-ignore
import 'virtual:svg-icons-register'
import { showLoading, hideLoading } from '@/plugins/loading'
import { setupRouter } from "./router"

async function setupApp() {
    // 显示 loading 动画
    showLoading()

    // 模拟异步加载（后续可替换为真实的初始化逻辑）
    // await new Promise((resolve) => setTimeout(resolve, 2000))

    // 创建并挂载应用
    const app = createApp(App)
    app.use(store)
    await setupRouter(app);
    hideLoading()
    app.mount('#app')

}

setupApp()
