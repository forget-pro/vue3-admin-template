<template>
  <n-dropdown :options="options" trigger="manual" placement="bottom-start" v-bind="$attrs"> </n-dropdown>
</template>

<script setup lang="ts">
import type { DropdownOption } from 'naive-ui'

import useStore from '@/store'

interface Iprops {
  tabKey: string
}
const props = defineProps<Iprops>()

const { useRouteStore, useLayoutTabStore } = useStore()

const renderIcon = (icon: string, sizeClass?: string) => h('span', { class: `${icon} ${sizeClass || 'text-20'}` })
const options = computed(() => {
  const firstRoute = useRouteStore.firstMenuOption?.key || ''
  const leftDisabled = props.tabKey == useLayoutTabStore.tabs[1]?.key // 左侧第一个标签页不能关闭
  const opts: DropdownOption[] = [
    {
      label: '关闭',
      key: 'close',
      icon: () => renderIcon('icon-[mdi--close]'),
      disabled: props.tabKey === firstRoute,
    },
    {
      label: '关闭其他',
      key: 'close-other',
      disabled: props.tabKey !== firstRoute && useLayoutTabStore.tabs.length <= 2,
      icon: () => renderIcon('icon-[mdi--arrow-expand-horizontal]', 'text-16'),
    },
    {
      label: '关闭左侧',
      key: 'close-left',
      icon: () => renderIcon('icon-[mdi--arrow-expand-left]', 'text-16'),
      disabled: props.tabKey === firstRoute || leftDisabled,
    },
    {
      label: '关闭右侧',
      key: 'close-right',
      icon: () => renderIcon('icon-[mdi--arrow-expand-right]', 'text-16'),
      disabled: props.tabKey == useLayoutTabStore.tabs[useLayoutTabStore.tabs.length - 1]?.key,
    },
    {
      label: '关闭所有',
      key: 'close-all',
      icon: () => renderIcon('icon-[mdi--close-circle-outline]', 'text-18'),
      disabled: props.tabKey !== firstRoute && useLayoutTabStore.tabs.length <= 2,
    },
  ]
  return opts
})
</script>

<style scoped></style>
