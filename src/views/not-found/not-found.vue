<template>
  <div class="flex h-screen flex-col items-center justify-center">
    <svg-icon name="icons-404" class="h-[400px] w-[400px]"></svg-icon>
    <span class="text-18 my-12 text-gray-400">Sorry, the page you visited does not exist.</span>
    <n-button type="primary" class="mt-12 px-12" @click="backhome">回首页</n-button>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const backhome = () => {
  router.push({ path: '/', replace: true })
}
</script>

<style scoped></style>
