<script setup lang="ts">
defineProps<{
  color: string
  text: string
}>()
</script>

<template>
  <a-tag :color="color">
    {{ text }}
  </a-tag>
</template>

<style scoped>
.ant-tag {
  color: #000000;
}
</style>
