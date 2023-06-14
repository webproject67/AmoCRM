<script setup lang="ts">
defineProps<{
  size: 'small'
}>()
</script>

<template>
  <a-avatar :size="size">
    <template #icon>
      <slot></slot>
    </template>
  </a-avatar>
</template>

<style scoped>
.ant-avatar {
  margin-right: 8px;
}
</style>
