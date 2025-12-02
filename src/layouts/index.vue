<template>
  <n-watermark content="Forget Admin" :font-size="16" :rotate="-15" :width="300" :height="160" :x-offset="24" :y-offset="40">
    <n-layout has-sider class="h-screen">
      <layout-sider :collapsed="state.collapsed" @collapse="state.collapsed = true" @expand="state.collapsed = false" />
      <n-layout embedded>
        <layout-header />
        <div class="bg-white">
          <layout-tab />
        </div>
        <n-layout-content class="m-16 flex-1 overflow-auto bg-transparent!">
          <RouterView v-slot="{ Component, route }">
            <Transition name="fade-slide" mode="out-in">
              <keep-alive :include="useRouteStore.keepAlive" :max="10">
                <component :is="Component" v-if="useRouteStore.refreshRoute" :key="route.fullPath" class="transition-300" />
              </keep-alive>
            </Transition>
          </RouterView>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </n-watermark>
</template>

<script setup lang="ts">
import useStore from '@/store'

import { useHookData } from './hook'
import layoutHeader from './layout-header/layout-header.vue'
import layoutSider from './layout-sider/layout-sider.vue'
import layoutTab from './layout-tab/layout-tab.vue'

const { useRouteStore } = useStore()

const { state, handleDropdownSelect } = useHookData()

provide('layoutContext', { state, handleDropdownSelect })
</script>

<style scoped lang="scss">
::v-deep(.n-layout-scroll-container) {
  display: flex;
  flex-direction: column;
}
.n-layout-sider {
  transition: all 0.3s ease;
}
</style>
