<script setup lang="ts">
defineProps<{
  color: string
}>()
</script>

<template>
  <a-tag :color="color">
    <slot></slot>
  </a-tag>
</template>

<style scoped>
.ant-tag {
  color: #000000;
}
</style>
