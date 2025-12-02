<template>
  <div class="mb-12 flex justify-end">
    <NPopover placement="bottom-end" trigger="click">
      <template #trigger>
        <NButton size="small" secondary>
          <template #icon>
            <span class="icon-[mdi--settings-outline]"></span>
          </template>
          <span>列设置</span>
        </NButton>
      </template>
      <VueDraggable v-model="columns" :animation="150" filter=".none_draggable">
        <div
          v-for="item in columns"
          :key="item.key"
          class="hover:bg-primary-100 rounded-4 flex h-36 items-center pr-12"
          :class="{ 'hidden': ['selection', 'expand'].includes(item.key) }">
          <span class="icon-[mdi--drag] text-24 mr-8 cursor-move"></span>
          <NCheckbox v-model:checked="item.checked" class="none_draggable flex-1">
            <template v-if="typeof item.title == 'function'">
              <component :is="item.title" />
            </template>
            <span v-else>{{ item.title }}</span>
          </NCheckbox>
        </div>
      </VueDraggable>
    </NPopover>
  </div>
</template>

<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'

const columns = defineModel<TabCheckColumns[]>('columns', { default: () => [] })

console.log(columns.value, 'columns')
</script>

<style scoped></style>
