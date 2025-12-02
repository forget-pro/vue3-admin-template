<template>
  <n-layout-header bordered>
    <div class="flex h-54 items-center justify-between pr-24 pl-12">
      <div class="flex items-center">
        <icon-button
          :key="String(layoutContext.state.collapsed)"
          :popover-content="layoutContext.state.collapsed ? '展开菜单' : '折叠菜单'"
          @click="layoutContext.state.collapsed = !layoutContext.state.collapsed">
          <LineMdMenuFoldLeft v-if="!layoutContext.state.collapsed" class="size-20 text-gray-500" />
          <LineMdMenuFoldRight v-else class="size-20 text-gray-500" />
        </icon-button>
        <div class="ml-12">
          <n-breadcrumb>
            <n-breadcrumb-item v-for="(item, index) in breadcumbList" :key="index">
              <span class="font-semibold">{{ item.label }} </span>
            </n-breadcrumb-item>
          </n-breadcrumb>
        </div>
      </div>
      <div>
        <n-dropdown :options="layoutContext.state.userDropdownOptions" @select="handleDropDownSelect">
          <n-button quaternary>
            <span class="icon-[mdi--user-tie] text-24 text-gray-500"></span>
            <span class="ml-8">Admin</span>
          </n-button>
        </n-dropdown>
      </div>
    </div>
  </n-layout-header>
</template>

<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import LineMdMenuFoldLeft from '~icons/line-md/menu-fold-left'
import LineMdMenuFoldRight from '~icons/line-md/menu-fold-right'

import useStore from '@/store'

import type { ILayoutContext } from '../hook'

const layoutContext = inject<ILayoutContext>('layoutContext')!

const { useRouteStore } = useStore()

const breadcumbList = computed(() => {
  return useRouteStore.breadcrumbList.map((item: MenuOption) => ({ icon: item.icon, label: item.label }))
})

const handleDropDownSelect = (key: string) => {
  layoutContext.handleDropdownSelect(key as any)
}
</script>

<style scoped></style>
