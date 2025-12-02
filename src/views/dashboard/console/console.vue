<template>
  <div>
    控制台 {{ useRouteStore.keepAlive }}
    <input type="text" placeholder="测试" />
  </div>
</template>

<script setup lang="ts">
import useStore from '@/store'

const { useRouteStore } = useStore()
</script>

<style scoped></style>
