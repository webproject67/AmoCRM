<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import TheLayout from './components/TheLayout.vue'
import TheTooltip from './components/TheTooltip.vue'
import TextField from './components/TextField.vue'
import TheAvatar from './components/TheAvatar.vue'
import TheTag from './components/TheTag.vue'
import TheContact from './components/TheContact.vue'
import { numberFormat, localeDate, responsibleUser, status } from './utils/index'
import { NameSpace } from './const'
import columns from './columns'
import {
  useDataStore,
  useSearchTextStore,
  useLoadingStatusStore,
  useWarningStatusStore
} from './stores/index'

const { STATUS_ID, RESPONSIBLE_USER_ID, CREATED_AT, PRICE } = NameSpace

const dataStore = useDataStore()
const warningStatusStore = useWarningStatusStore()

const { data } = storeToRefs(dataStore)
const { searchText } = storeToRefs(useSearchTextStore())
const { isLoaded } = storeToRefs(useLoadingStatusStore())

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
        <TextField v-model="searchText" placeholder="Поиск сделок" :autofocus="true">
          <loading-outlined v-if="isLoaded" />
          <search-outlined v-else />
        </TextField>
      </template>
    </a-card>
    <a-spin :spinning="isLoaded">
      <a-card>
        <a-table :dataSource="data.leads" :columns="columns" :pagination="false">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === RESPONSIBLE_USER_ID">
              <TheAvatar />
              {{ responsibleUser(data.users, record.responsible_user_id) }}
            </template>
            <template v-if="column.key === STATUS_ID">
              <TheTag
                :color="status(data.pipelines, record.pipeline_id, record.status_id)"
                :text="status(data.pipelines, record.pipeline_id, record.status_id, 'text')"
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
