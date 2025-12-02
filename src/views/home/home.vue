<template>
  <div class="flex h-full flex-col">
    <search-form :schema="searchSchema" v-model="formData" :collapsed-count="4" />
    <n-card :bordered="false" class="mt-12 flex-1" title="示例表格">
      <template #header-extra>
        <common-table-header v-model:columns="checkColumns"></common-table-header>
      </template>
      <n-data-table :columns="columns" :data="data" :row-key="(row) => row.no" :bordered="false" class="h-full flex-1" />
    </n-card>

    <!-- <common-table :columns="columns" :data="data" :bordered="false"> </common-table> -->
  </div>
</template>

<script setup lang="ts">
import { useTable } from '@/hook/useTable'

import { searchSchema } from './search.schema'
import { tabColumns } from './tab-column'

const operAction = (row: any) => {
  console.log(3223, row)
}

const { checkColumns, columns } = useTable({
  columns: () => tabColumns(operAction),
})

const formData = reactive({ name: '23232' })

const data = [
  { no: 3, title: 'Wonderwall', length: '4:18' },
  { no: 4, title: "Don't Look Back in Anger", length: '4:48' },
  { no: 12, title: 'Champagne Supernova', length: '7:27' },
]
</script>

<style scoped></style>
