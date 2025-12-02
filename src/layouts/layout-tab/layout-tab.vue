<template>
  <div class="flex h-44 items-center px-16 shadow-xs">
    <div class="h-full flex-1 overflow-hidden">
      <div ref="bsScroll" class="scroll-tab h-full overflow-x-auto overflow-y-hidden scroll-smooth">
        <TransitionGroup name="fade" tag="div" class="inline-flex h-full items-end pr-18" ref="tabRef">
          <div
            class="chrome-tab relative -mr-20 inline-flex cursor-pointer items-center px-32 py-6 whitespace-nowrap"
            v-for="item in useLayoutTabStore.tabs"
            :key="item.key"
            :tab-data-id="item.key"
            :class="{ 'chrome-tab_active font-semibold': item.key == route.fullPath }"
            @pointerdown="handleTabMenu($event, item)"
            @contextmenu="handleContextMenu($event, item)">
            <div class="chrome-tab__bg pointer-events-none absolute top-0 left-0 -z-10 size-full">
              <chrome-tab-bg />
            </div>
            <span :class="item.icon" v-if="item.icon" class="mr-6"></span>
            <span> {{ item.title }}</span>
            <div class="close-icon rounded-50 ml-8 flex items-center p-2" v-if="useRouteStore.firstMenuOption?.key !== item.key" @click="handleMenuSelect('close', item.key)">
              <span class="icon-[mdi--close] text-16"></span>
            </div>
            <div class="chrome-tab-divider absolute right-8 h-16 bg-[#1f2225]" />
          </div>
        </TransitionGroup>
      </div>
    </div>
    <div class="ml-24 flex gap-12">
      <icon-button popover-content="刷新" @click="refreshRouter">
        <div class="flex items-center">
          <span class="icon-[mdi--refresh] text-20" :class="{ 'animate-spin': !useRouteStore.refreshRoute }"></span>
        </div>
      </icon-button>
      <icon-button popover-content="全屏" @click="toggleFullscreen">
        <div class="flex items-center">
          <span class="icon-[mdi--fullscreen] text-22"></span>
        </div>
      </icon-button>
    </div>
    <context-menu
      :tab-key="contextMenuRect.key"
      :show="layoutContext.state.showContextMenu"
      :x="contextMenuRect.x"
      :y="contextMenuRect.y"
      :on-clickoutside="onClickoutside"
      @select="handleMenuSelect" />
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn, useElementBounding } from '@vueuse/core'

import useStore from '@/store'

import type { ILayoutContext, TabMenuKey } from '../hook'
import chromeTabBg from './chrome-tab-bg.vue'
import contextMenu from './context-menu.vue'

const route = useRoute()

const router = useRouter()

const { useRouteStore, useLayoutTabStore } = useStore()

const layoutContext = inject<ILayoutContext>('layoutContext')!

const bsScroll = useTemplateRef<HTMLDivElement>('bsScroll')

const tabRef = useTemplateRef<HTMLElement>('tabRef')

const { width: bsWrapperWidth, left: bsWrapperLeft } = useElementBounding(bsScroll)

const contextMenuRect = reactive({
  x: 0,
  y: 0,
  key: '',
})

let isClickContextMenu = false

const refreshRouter = () => {
  if (!useRouteStore.refreshRoute) return
  useRouteStore.setState({ refreshRoute: false })
  setTimeout(() => {
    useRouteStore.setState({ refreshRoute: true })
  }, 500)
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// 鼠标拖动滚动相关状态
const dragState = reactive({
  isDragging: false,
  startX: 0,
  scrollLeft: 0,
  hasMoved: false, // 标记是否真的拖动了
})

// 缓存当前激活 tab 的索引，避免重复查找
const activeTabIndex = computed(() => {
  return useLayoutTabStore.tabs.findIndex((tab) => tab.key === route.fullPath)
})

const scrollToActiveTab = async () => {
  // TransitionGroup 组件需要通过 $el 访问实际的 DOM 元素
  const tabElement = (tabRef.value as any)?.$el as HTMLElement
  if (!tabElement || activeTabIndex.value === -1) return
  // 直接通过索引获取元素
  const activeTabElement = tabElement.children[activeTabIndex.value] as HTMLElement
  if (activeTabElement) {
    const { left, width } = activeTabElement.getBoundingClientRect()
    const clientX = left + width / 2
    scrollByClientX(clientX)
  }
}

const debouncedScrollToActiveTab = useDebounceFn(() => {
  scrollToActiveTab()
}, 200)

const scrollByClientX = (clientX: number) => {
  if (!bsScroll.value) return

  const scrollElement = bsScroll.value
  // 标签在视口中的位置 - 滚动容器在视口中的左边缘位置 = 标签相对于容器的可见位置
  const tabPositionInViewport = clientX - bsWrapperLeft.value
  // 标签在内容中的实际位置 = 标签的可见位置 + 当前已滚动的距离
  const tabPositionInContent = tabPositionInViewport + scrollElement.scrollLeft
  // 目标滚动位置 = 标签在内容中的位置 - 容器宽度的一半
  const targetScrollLeft = tabPositionInContent - bsWrapperWidth.value / 2

  scrollElement.scrollTo({
    left: targetScrollLeft,
    behavior: 'smooth',
  })
}

const handleTabMenu = async (e: MouseEvent, item: LayoutTabItem) => {
  if ([1, 2].includes(e.button)) return // 中键、右键 不处理
  // 如果是拖动操作，不触发路由跳转
  if (dragState.hasMoved) {
    e.preventDefault()
    return
  }

  setTimeout(() => {
    router.replace(item.key as string)
  }, 0)
}

const handleContextMenu = (e: MouseEvent, item: any) => {
  e.preventDefault()
  const { clientX, clientY } = e
  isClickContextMenu = true
  const DURATION = layoutContext.state.showContextMenu ? 200 : 0
  layoutContext.state.showContextMenu = false
  setTimeout(() => {
    layoutContext.state.showContextMenu = true
    contextMenuRect.x = clientX
    contextMenuRect.y = clientY
    contextMenuRect.key = item.key
    isClickContextMenu = false
  }, DURATION)
}

const onClickoutside = () => {
  //   if (!layoutContext.state.showContextMenu) return
  if (isClickContextMenu) return
  layoutContext.state.showContextMenu = false
}

const handleMenuSelect = (key: TabMenuKey, handleKey?: string) => {
  const handleEvent: Record<TabMenuKey, () => void> = {
    'close': () => {
      const redict = useLayoutTabStore.handleRemoveTab(handleKey || contextMenuRect.key, route.fullPath)
      redict && router.replace(redict)
    },
    'close-other': () => {
      useLayoutTabStore.handleClearOtherTab(contextMenuRect.key, route.fullPath)
    },
    'close-left': () => {
      const redict = useLayoutTabStore.handleClearLeftTab(contextMenuRect.key, route.fullPath)
      redict && router.replace(redict)
    },
    'close-right': () => {
      const redict = useLayoutTabStore.handleClearRightTab(contextMenuRect.key, route.fullPath)
      redict && router.replace(redict)
    },
    'close-all': () => {
      useLayoutTabStore.handleClearTab()
      router.replace(useRouteStore.firstMenuOption?.key || '/')
    },
  }
  handleEvent[key]?.()
  layoutContext.state.showContextMenu = false

  // useLayoutTabStore.handleContextMenuAction(key, contextMenuRect.key)
}

watch(
  () => bsWrapperWidth.value,
  () => {
    debouncedScrollToActiveTab()
  }
)
watch(
  () => activeTabIndex.value,
  () => {
    scrollToActiveTab()
  }
)
</script>

<style scoped lang="scss">
.scroll-tab {
  // 隐藏滚动条 兼容性写法
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}
.chrome-tab__bg {
  color: transparent;
}
.chrome-tab:hover {
  z-index: 10;
  > .chrome-tab__bg {
    color: #dee1e6;
  }
  .chrome-tab-divider {
    opacity: 0;
  }
}
.chrome-tab_active {
  z-index: 11;
  color: var(--color-primary-600);
  > .chrome-tab__bg {
    color: var(--color-mix-primary);
  }
  &:hover > .chrome-tab__bg {
    color: var(--color-mix-primary);
  }
  .chrome-tab-divider {
    opacity: 0;
  }
}
.close-icon:hover {
  background: #9ca3af;
  color: #fff;
}
.chrome-tab-divider {
  width: 1px;
}

/* 隐藏滚动条 */
:deep(div[ref='bsScroll'])::-webkit-scrollbar {
  display: none;
}
</style>
