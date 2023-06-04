<script setup lang="ts">
import { WarningOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import { useWarningStatusStore } from '../stores/index'

const warningStatusStore = useWarningStatusStore()
const { isWarned } = storeToRefs(warningStatusStore)
</script>

<template>
  <a-tooltip v-if="isWarned" title="Поиск работает от 3 символов">
    <warning-outlined />
  </a-tooltip>
</template>

<style scoped>
.anticon-warning {
  margin: 0 10px;
  color: red;
}
</style>
