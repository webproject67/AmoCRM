<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue'
import TheAvatar from './TheAvatar.vue'
import TheDivider from './TheDivider.vue'
import { Communication } from '../const'

const { PHONE, EMAIL } = Communication

defineProps<{
  contact: {
    name: string
    custom_fields_values: {
      field_code: typeof EMAIL | typeof PHONE
      values: {
        value: string
      }[]
    }[]
  }
}>()
</script>

<template>
  <div class="contact">
    <TheAvatar size="small">
      <UserOutlined />
    </TheAvatar>
    {{ contact.name }}
    <template v-for="contacts in contact.custom_fields_values" :key="contacts">
      <template v-for="contact in contacts.values" :key="contact">
        <TheDivider :contacts="contacts" :contact="contact" />
      </template>
    </template>
  </div>
</template>

<style scoped>
.contact {
  padding: 10px 50px;
}

.anticon-phone {
  transform: rotate(90deg);
}
</style>
