<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder: string
  autofocus: boolean
  type?: string
}>()
</script>

<template>
  <a-input
    :type="type || 'text'"
    :placeholder="placeholder"
    :value="modelValue"
    :autofocus="autofocus"
    @input="$emit('update:modelValue', $event.target.value)"
  >
    <template #suffix>
      <slot></slot>
    </template>
  </a-input>
</template>

<style scoped>
.ant-input-affix-wrapper {
  width: 300px;
}
</style>
