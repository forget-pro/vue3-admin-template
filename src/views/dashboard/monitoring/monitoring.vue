<template>
  <div>
    监控页

    <input type="text" placeholder="测试动态路由" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
console.log(route.query.a)
</script>

<style scoped></style>
