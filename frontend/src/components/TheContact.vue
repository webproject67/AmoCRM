<script setup lang="ts">
import { PhoneOutlined, MailOutlined } from '@ant-design/icons-vue'
import TheAvatar from './TheAvatar.vue'
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
    <TheAvatar />
    {{ contact.name }}
    <template v-for="communication in contact.custom_fields_values" :key="communication">
      <template v-if="communication.field_code === PHONE">
        <template v-for="phone in communication.values" :key="phone">
          <a-divider type="vertical" />
          <a :href="'tel:' + phone.value">
            <phone-outlined />
          </a>
        </template>
      </template>
      <template v-if="communication.field_code === EMAIL">
        <template v-for="email in communication.values" :key="email">
          <a-divider type="vertical" />
          <a :href="'mailto:' + email.value">
            <mail-outlined />
          </a>
        </template>
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
