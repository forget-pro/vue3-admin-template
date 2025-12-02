<template>
  <n-select :options="options" v-bind="$attrs"> </n-select>
</template>

<script setup lang="ts">
import type { SelectOption } from 'naive-ui'

interface Iprops {
  asyncOptions?: () => Promise<Array<{ label: string; value: any }>>
  options?: Array<{ label: string; value: any }>
}

const props = defineProps<Iprops>()

const options = ref<SelectOption[]>([])

onMounted(async () => {
  if (props.asyncOptions && typeof props.asyncOptions === 'function') {
    options.value = await props.asyncOptions()
  }
})
</script>

<style scoped></style>
