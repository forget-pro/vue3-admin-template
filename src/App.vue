<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="themeOverrides" inline-theme-disabled abstract :breakpoints="breakpoints">
    <app-provider>
      <router-view />
    </app-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { dateZhCN, zhCN } from 'naive-ui'
import { onMounted } from 'vue'

import { breakpoints } from '@/config/setting'

import useTheme from './hook/useTheme'
import useStore from './store'

const route = useRoute()

const { themeOverrides } = useTheme()

const { useRouteStore } = useStore()

// 初始化主题
onMounted(() => {
  // console.log('主题色板:', themeColors.value)
  // // 检查 CSS 变量是否设置成功
  // const root = document.documentElement
  // console.log('CSS 变量 --color-primary-500:', getComputedStyle(root).getPropertyValue('--color-primary-500'))
  // console.log('CSS 变量 --color-primary-600:', getComputedStyle(root).getPropertyValue('--color-primary-600'))
})

watchEffect(() => {
  // console.log(route.path, '当前路由路径变化---App.vue---watchEffect')
  const breadcrumbList = useRouteStore.getMenuPathByKey(route.path)
  useRouteStore.setState({ breadcrumbList: breadcrumbList || [] })
})
</script>

<style></style>
