<script setup lang="ts">
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons-vue'

defineProps<{
  isLoaded: boolean
  modelValue: string
}>()
</script>

<template>
  <a-input
    type="text"
    placeholder="Поиск сделок"
    autofocus
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  >
    <template #suffix>
      <loading-outlined v-if="isLoaded" />
      <search-outlined v-else />
    </template>
  </a-input>
</template>

<style scoped>
.ant-input-affix-wrapper {
  width: 300px;
}
</style>
