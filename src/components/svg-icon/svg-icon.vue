<template>
  <svg aria-hidden="true" width="1em" height="1em" v-bind="bindAttrs">
    <use :xlink:href="`#icon-${props.name}`" fill="currentColor" />
  </svg>
</template>

<script setup lang="ts">
interface ISvgIconProps {
  name: string
}

const props = withDefaults(defineProps<ISvgIconProps>(), {
  name: '',
})

const attrs = useAttrs()

const bindAttrs = computed<{ class: string; style: string }>(() => ({
  class: (attrs.class as string) || '',
  style: (attrs.style as string) || '',
}))
</script>

<style scoped></style>
