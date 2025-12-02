<template>
  <div class="w-full select-none">
    <div
      ref="containerRef"
      class="relative overflow-hidden rounded border border-solid border-[#e4e4e7] transition-all duration-300"
      :class="state.isSuccess ? 'bg-green-500' : 'bg-[rgba(230,231,242,0.9)]'"
      :style="{ height: `${props.height}px` }">
      <!-- 滑动遮罩层 -->
      <div
        class="absolute top-0 left-0 h-full rounded"
        :class="[
          state.isSuccess ? 'bg-linear-to-r from-green-400 to-green-500' : 'bg-linear-to-r from-green-300 to-green-400',
          { 'transition-all duration-500 ease-out': !state.isDragging },
        ]"
        :style="{ width: state.maskWidth }" />

      <!-- 提示文字（带光影扫描） -->
      <div class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <span v-if="!state.isSuccess" class="ben-spine-text text-sm font-medium"> {{ text }} </span>
        <span v-else class="text-sm font-medium text-white transition-all duration-300">
          {{ successText }}
        </span>
      </div>

      <!-- 滑块按钮 -->
      <div
        class="absolute top-0 z-20 flex h-full w-48 cursor-pointer items-center justify-center bg-white"
        :class="[state.isSuccess ? 'rounded-r' : 'rounded', { 'transition-all duration-500 ease-out': !state.isDragging }]"
        :style="{ left: state.sliderLeft }"
        @mousedown="handleMouseDown"
        @touchstart="handleTouchStart">
        <!-- 滑块图标 -->
        <div class="relative flex h-20 w-20 items-center justify-center overflow-hidden font-semibold text-gray-500">
          <Transition
            enter-active-class="transition-all duration-500"
            enter-from-class="opacity-0 -rotate-y-180 scale-50"
            enter-to-class="opacity-100 rotate-y-0 scale-100"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 rotate-y-0 scale-100"
            leave-to-class="opacity-0 rotate-y-180 scale-50"
            mode="out-in">
            <span class="icon-[mdi--arrow-right] text-24" v-if="!state.isSuccess" key="arrow"></span>
            <span v-else class="icon-[mdi--check] text-24 font-bold" key="check"></span>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormItemInst } from 'naive-ui'
import { computed, inject, onMounted, onUnmounted } from 'vue'

import { useState } from '@/hook/useState'

interface Props {
  modelValue?: boolean
  text?: string
  successText?: string
  height?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  text: '请按住滑块拖动',
  successText: '验证成功',
  height: 38,
  disabled: false,
})

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
  (e: 'fail'): void
  (e: 'reset'): void
}

const emit = defineEmits<Emits>()

const containerRef = useTemplateRef<HTMLElement>('containerRef')

// 注入 form-item 实例，用于触发表单验证
const nFormItem = inject<FormItemInst | null>('n-form-item', null)

const { state, setState } = useState({
  sliderLeft: '0px',
  maskWidth: '0px',
  isSuccess: false,
  isDragging: false,
  startX: 0,
  currentX: 0,
  containerWidth: 320,
})

const maxWidth = computed(() => state.containerWidth - 48) // 48是滑块按钮的宽度 (w-12 = 3rem = 48px)

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (containerRef.value) {
    setState({ containerWidth: containerRef.value.offsetWidth })
    // 监听窗口大小变化
    resizeObserver = new ResizeObserver(() => {
      if (containerRef.value) {
        setState({ containerWidth: containerRef.value.offsetWidth })
      }
    })
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  // 清理 ResizeObserver
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  // 清理事件监听器（防止内存泄漏）
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
})

const handleMouseDown = (e: MouseEvent) => {
  if (props.disabled || state.isSuccess) return
  setState({ isDragging: true, startX: e.clientX })
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleTouchStart = (e: TouchEvent) => {
  if (props.disabled || state.isSuccess) return
  if (!e.touches[0]) return
  setState({ isDragging: true, startX: e.touches[0].clientX })
  document.addEventListener('touchmove', handleTouchMove)
  document.addEventListener('touchend', handleTouchEnd)
}

const handleMouseMove = (e: MouseEvent) => {
  if (!state.isDragging) return

  const moveX = e.clientX - state.startX
  const newCurrentX = Math.max(0, Math.min(moveX, maxWidth.value))

  setState({
    currentX: newCurrentX,
    sliderLeft: `${newCurrentX}px`,
    maskWidth: `${newCurrentX + 48}px`,
  })
}

const handleTouchMove = (e: TouchEvent) => {
  if (!state.isDragging) return
  if (!e.touches[0]) return

  const moveX = e.touches[0].clientX - state.startX
  const newCurrentX = Math.max(0, Math.min(moveX, maxWidth.value))

  setState({
    currentX: newCurrentX,
    sliderLeft: `${newCurrentX}px`,
    maskWidth: `${newCurrentX + 48}px`,
  })
}

const handleMouseUp = () => {
  if (!state.isDragging) return
  setState({ isDragging: false })
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)

  checkSuccess()
}

const handleTouchEnd = () => {
  if (!state.isDragging) return
  setState({ isDragging: false })
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)

  checkSuccess()
}

const checkSuccess = () => {
  // 判断是否滑动到最右边（允许有2px的误差）
  if (state.currentX >= maxWidth.value - 2) {
    setState({ isSuccess: true })
    emit('update:modelValue', true)
    emit('success')

    // 触发表单项验证 - 通过 DOM 查找父 form-item 元素
    triggerFormItemValidation()
  } else {
    // 验证失败，重置
    reset()
    emit('fail')
  }
}

// 触发表单项验证
const triggerFormItemValidation = () => {
  // 使用内部方法触发验证
  if (nFormItem) {
    ;(nFormItem as any).handleContentChange?.()
  }
}

const reset = () => {
  setState({
    sliderLeft: '0px',
    maskWidth: '0px',
    currentX: 0,
    isSuccess: false,
  })

  emit('update:modelValue', false)
  emit('reset')

  // 触发表单项验证
  triggerFormItemValidation()
}

// 暴露重置方法给父组件
defineExpose({
  reset,
})
</script>

<style scoped>
@keyframes shineScan {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.ben-spine-text {
  background:
    radial-gradient(circle at center, #fffc, #f000) -200% 50% / 200% 100% no-repeat,
    #999;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: 2s linear 0s infinite normal none running shineScan;
}

/* 3D 翻转效果 */
.rotate-y-0 {
  transform: rotateY(0deg);
}

.-rotate-y-180 {
  transform: rotateY(-180deg);
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
