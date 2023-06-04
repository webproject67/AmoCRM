<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import TheLayout from './components/TheLayout.vue'
import TheTooltip from './components/TheTooltip.vue'
import TextField from './components/TextField.vue'
import TheAvatar from './components/TheAvatar.vue'
import TheTag from './components/TheTag.vue'
import TheContact from './components/TheContact.vue'
import { NameSpace } from './const'
import columns from './columns'
import {
  useDataStore,
  useSearchTextStore,
  useLoadingStatusStore,
  useWarningStatusStore
} from './stores/index'
import type { IPipeline } from './types'

const { STATUS_ID, RESPONSIBLE_USER_ID, CREATED_AT, PRICE } = NameSpace

const dataStore = useDataStore()
const warningStatusStore = useWarningStatusStore()

const { data } = storeToRefs(dataStore)
const { searchText } = storeToRefs(useSearchTextStore())
const { isLoaded } = storeToRefs(useLoadingStatusStore())

const numberFormat = (value: number): string =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(value)

const localeDate = (value: number): string =>
  new Date(value * 1000)
    .toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    .replace(/\s*г\./, '')

const getResponsibleUser = (id: number): string => {
  const user = data.value.users.find((user) => user.id === id)
  return user ? user.name : 'error'
}

const getStatus = (pipelineId: number, statusId: number, value?: string): string => {
  const pipeline = data.value.pipelines.filter((pipeline: IPipeline) => pipeline.id === pipelineId)

  const status = pipeline[0]._embedded.statuses.find((status) => status.id === statusId)

  if (status) return value === 'text' ? status.name : status.color

  return 'error'
}

watch(searchText, () => {
  if (searchText.value.length >= 3 || searchText.value.length === 0) {
    warningStatusStore.setWarned(false)
    dataStore.setData()
    return
  }

  warningStatusStore.setWarned(true)
})

onMounted(() => dataStore.setData())
</script>

<template>
  <TheLayout>
    <a-card title="Пример тестового задания">
      <template #extra>
        <TheTooltip />
        <TextField v-model="searchText" />
      </template>
    </a-card>
    <a-spin :spinning="isLoaded">
      <a-card>
        <a-table :dataSource="data.leads" :columns="columns" :pagination="false">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === RESPONSIBLE_USER_ID">
              <TheAvatar />
              {{ getResponsibleUser(record.responsible_user_id) }}
            </template>
            <template v-if="column.key === STATUS_ID">
              <TheTag
                :color="getStatus(record.pipeline_id, record.status_id)"
                :text="getStatus(record.pipeline_id, record.status_id, 'text')"
              />
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
  </TheLayout>
</template>
