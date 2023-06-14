<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <a-tooltip :title="title">
    <slot></slot>
  </a-tooltip>
</template>

<style>
.anticon-warning {
  margin: 0 10px;
  color: red;
}
</style>
