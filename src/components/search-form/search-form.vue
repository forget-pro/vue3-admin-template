<template>
  <div class="rounded-8 bg-white p-24 dark:bg-black">
    <n-form :model="modelValue" label-placement="left" label-width="auto" ref="formRef">
      <n-grid :x-gap="24" ref="gridRef" responsive="screen" item-responsive>
        <n-grid-item v-for="field in visibleFields" :key="field.key" :span="gridItemSpan">
          <n-form-item :label="field.label" :path="field.key">
            <component :is="renderFormItem(field)" />
          </n-form-item>
        </n-grid-item>
        <n-grid-item :span="buttonGridSpan">
          <div class="flex items-center" :class="{ 'justify-end': props.buttonPlacement == 'right' }">
            <n-button @click="resetForm">
              <template #icon>
                <span class="icon-[mdi--backup-restore]"></span>
              </template>
              <span>重置</span>
            </n-button>
            <n-button type="primary" :loading="state.submitLoading" @click="handleSubmit" class="ml-12!">
              <template #icon>
                <span class="icon-[mdi--search]"></span>
              </template>
              <span>搜索</span>
            </n-button>
            <n-button v-if="showToggle" text type="primary" @click="state.collapsed = !state.collapsed" class="ml-12!">
              <span> {{ state.collapsed ? '展开' : '收起' }}</span>
              <span class="icon-[mdi--keyboard-arrow-down] text-20 transition-all duration-300" :style="{ transform: state.collapsed ? 'rotate(0deg)' : 'rotate(180deg)' }"></span>
            </n-button>
          </div>
        </n-grid-item>
      </n-grid>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import type { BreakPointKey } from '@/config/setting'
import { useBreakPoint } from '@/hook/useBreakPoint'

import { naiveComponentMap } from './component'
import type { NaiveSearchField, NaiveSearchSchema } from './component'
import { useHookData } from './hook'

interface Iprops {
  schema?: NaiveSearchSchema
  span?: number | { xs?: number; s?: number; m?: number; l?: number; xl?: number; xxl?: number }
  collapsedCount?: number //默认显示字段数
  buttonPlacement?: 'left' | 'right' // 按钮位置
}

const props = withDefaults(defineProps<Iprops>(), {
  schema: () => [],
  span: () => ({
    xs: 24,
    m: 24,
    s: 12,
    l: 8,
    xl: 6,
    xxl: 6,
  }),
  collapsedCount: 4,
  buttonPlacement: 'right',
})

const { state } = useHookData()

const { currentPoint } = useBreakPoint()

const modelValue = defineModel<Record<string, any>>('modelValue', {
  default: () => ({}),
})

const gridItemSpan = computed(() => {
  if (typeof props.span === 'number') {
    return props.span
  }
  return props.span[currentPoint.value as BreakPointKey] ?? 24
})

// 控制显示字段
const visibleFields = computed(() => {
  if (!props.collapsedCount || props.schema.length <= props.collapsedCount) {
    return props.schema
  }
  return state.collapsed ? props.schema.slice(0, props.collapsedCount) : props.schema
})

const showToggle = computed(() => {
  return props.collapsedCount && props.schema.length > props.collapsedCount
})

const buttonGridSpan = computed(() => {
  const totalSpan = 24
  const used = visibleFields.value.length * gridItemSpan.value
  const remainder = used % totalSpan
  return remainder === 0 ? totalSpan : totalSpan - remainder
})

const resetForm = () => {
  Object.keys(modelValue.value).forEach((key) => {
    modelValue.value[key] = null
  })
}

const handleSubmit = () => {
  state.submitLoading = true
  setTimeout(() => {
    state.submitLoading = false
  }, 500)
}

const renderFormItem = (item: NaiveSearchField) => {
  const component = naiveComponentMap[item.type]
  if (!component) return h('div', `未适配 ${item.type} 组件`)
  return h(component as any, {
    clearable: true,
    ...item.props,
    style: { width: '100%' },
    value: modelValue.value[item.key],
    'onUpdate:value': (val: any) => {
      modelValue.value[item.key] = val
    },
  })
}
</script>

<style scoped></style>
