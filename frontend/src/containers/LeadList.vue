<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { UserOutlined } from '@ant-design/icons-vue'
import TheAvatar from '../components/TheAvatar.vue'
import TheTag from '../components/TheTag.vue'
import TheContact from '../components/TheContact.vue'
import { numberFormat, localeDate, responsibleUser, status } from '../utils/index'
import { NameSpace } from '../const'
import columns from '../columns'
import { useDataStore, useLoadingStatusStore } from '../stores/index'

const { STATUS_ID, RESPONSIBLE_USER_ID, CREATED_AT, PRICE } = NameSpace

const { data } = storeToRefs(useDataStore())
const { isLoaded } = storeToRefs(useLoadingStatusStore())
</script>

<template>
  <a-spin :spinning="isLoaded">
    <a-card>
      <a-table :dataSource="data.leads" :columns="columns" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === RESPONSIBLE_USER_ID">
            <TheAvatar size="small">
              <UserOutlined />
            </TheAvatar>
            {{ responsibleUser(data.users, record.responsible_user_id) }}
          </template>
          <template v-if="column.key === STATUS_ID">
            <TheTag :color="status(data.pipelines, record.pipeline_id, record.status_id)">
              {{ status(data.pipelines, record.pipeline_id, record.status_id, 'text') }}
            </TheTag>
          </template>
          <template v-if="column.key === CREATED_AT">
            {{ localeDate(record.created_at) }}
          </template>
          <template v-if="column.key === PRICE">
            {{ numberFormat(record.price) }}
          </template>
        </template>
        <template #expandedRowRender="{ record }">
          <template v-for="contact in record.contacts" :key="contact">
            <TheContact :contact="contact" />
          </template>
        </template>
      </a-table>
    </a-card>
  </a-spin>
</template>
