<template>
  <n-layout-sider collapse-mode="width" :collapsed="layoutContext.state.collapsed" :collapsed-width="64" :width="200" class="shadow-sider">
    <div class="flex h-54 items-center justify-center border-b border-gray-100">
      <div v-if="!layoutContext.state.collapsed" class="text-xl font-bold text-gray-800">品牌</div>
      <div v-else class="text-lg font-bold text-gray-800">CP</div>
    </div>
    <n-menu
      :collapsed="layoutContext.state.collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="useRouteStore.menuOptions"
      :indent="18"
      :value="menuActiveKey"
      v-model:expanded-keys="expandedKeys"
      @update:value="handleMenuChange" />
  </n-layout-sider>
</template>

<script setup lang="ts">
import useStore from '@/store'

import type { ILayoutContext } from '../hook'

const layoutContext = inject<ILayoutContext>('layoutContext')!

const { useRouteStore } = useStore()

const expandedKeys = ref<string[]>([])

const router = useRouter()

const route = useRoute()

const menuActiveKey = computed(() => route.path)

const handleMenuChange = (key: string) => {
  router.push(key)
}
onMounted(() => {
  const menuOptions = useRouteStore.getMenuPathByKey(route.path) || []
  const keys = menuOptions.map((item) => item.key as string)
  expandedKeys.value = keys
})
</script>

<style scoped lang="scss">
.shadow-sider {
  box-shadow:
    0 0 rgb(0 0 0 / 0),
    0 0 rgb(0 0 0 / 0),
    3px 0 8px 0 rgb(29, 35, 41, 0.05);
}
</style>
