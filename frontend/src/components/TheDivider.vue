<script setup lang="ts">
import { PhoneOutlined, MailOutlined } from '@ant-design/icons-vue'
import { Communication } from '../const'

const { PHONE, EMAIL } = Communication

defineProps<{
  contacts: {
    field_code: typeof EMAIL | typeof PHONE
  }
  contact: {
    value: string
  }
}>()
</script>

<template>
  <a-divider type="vertical" />
  <template v-if="contacts.field_code === PHONE">
    <a :href="'tel:' + contact.value">
      <phone-outlined />
    </a>
  </template>
  <template v-if="contacts.field_code === EMAIL">
    <a :href="'mailto:' + contact.value">
      <mail-outlined />
    </a>
  </template>
</template>
