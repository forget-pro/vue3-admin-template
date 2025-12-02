<template>
  <NTooltip :placement="props.placement" :z-index="props.zIndex" :disabled="!props.popoverContent">
    <template #trigger>
      <NButton quaternary v-bind="$attrs">
        <div class="flex-center gap-8">
          <slot />
        </div>
      </NButton>
    </template>
    {{ props.popoverContent }}
  </NTooltip>
</template>

<script setup lang="ts">
import type { PopoverProps } from 'naive-ui'

interface Isprops {
  placement?: PopoverProps['placement']
  popoverContent?: string | number
  zIndex?: number
}

const props = withDefaults(defineProps<Isprops>(), {
  placement: 'bottom',
  popoverContent: '',
  zIndex: 1000,
})
</script>

<style scoped></style>
