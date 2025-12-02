<template>
  <n-message-provider>
    <n-dialog-provider>
      <n-loading-bar-provider>
        <slot />
      </n-loading-bar-provider>
    </n-dialog-provider>
  </n-message-provider>
</template>

<script setup></script>

<style lang="scss" scoped></style>
