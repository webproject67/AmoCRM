<script setup lang="ts">
import { WarningOutlined } from '@ant-design/icons-vue'

defineProps<{
  isVisible: boolean
}>()
</script>

<template>
  <a-tooltip v-if="isVisible" title="Поиск работает от 3 символов">
    <warning-outlined />
  </a-tooltip>
</template>

<style scoped>
.anticon-warning {
  margin: 0 10px;
  color: red;
}
</style>
