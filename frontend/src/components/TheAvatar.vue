<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue'
</script>

<template>
  <a-avatar size="small">
    <template #icon>
      <UserOutlined />
    </template>
  </a-avatar>
</template>

<style scoped>
.ant-avatar {
  margin-right: 8px;
}
</style>
