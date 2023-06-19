<script setup lang="ts">
import { ref, type Ref, onMounted, watch } from 'vue'
import {
  SearchOutlined,
  LoadingOutlined,
  WarningOutlined,
  UserOutlined
} from '@ant-design/icons-vue'
import TheLayout from './components/TheLayout.vue'
import TheTooltip from './components/TheTooltip.vue'
import TextField from './components/TextField.vue'
import TheAvatar from './components/TheAvatar.vue'
import TheTag from './components/TheTag.vue'
import TheContact from './components/TheContact.vue'
import { numberFormat, localeDate, responsibleUser, status, getData } from './utils/index'
import { NameSpace } from './const'
import columns from './columns'
import type { IData, ILead, IColumn } from './types'

const { STATUS_ID, RESPONSIBLE_USER_ID, CREATED_AT, PRICE } = NameSpace

const data: Ref<IData> = ref({ leads: [], pipelines: [], users: [] })
const searchText = ref('')
const errorMessage = ref('')
const isWarned = ref(false)
const isLoaded = ref(false)

watch(searchText, () => {
  const searchTextValue = searchText.value

  if (searchTextValue.length >= 3 || searchTextValue.length === 0) {
    isWarned.value = false
    loadData(searchTextValue)
    return
  }

  isWarned.value = true
})

onMounted(() => loadData())

async function loadData(searchTextValue?: string): Promise<void> {
  isLoaded.value = true
  const loadData = await getData(searchTextValue)
  if (typeof loadData === 'object') {
    data.value = loadData
    errorMessage.value = ''
  }
  if (typeof loadData === 'string') errorMessage.value = loadData
  isLoaded.value = false
}
</script>

<template>
  <TheLayout>
    <a-alert v-if="errorMessage" type="error" :message="errorMessage" banner />
    <a-card title="Пример тестового задания">
      <template #extra>
        <TheTooltip v-if="isWarned" title="Поиск работает от 3 символов">
          <warning-outlined />
        </TheTooltip>
        <TextField v-model="searchText" placeholder="Поиск сделок" :autofocus="true">
          <loading-outlined v-if="isLoaded" />
          <search-outlined v-else />
        </TextField>
      </template>
    </a-card>
    <a-spin :spinning="isLoaded">
      <a-card>
        <a-table :dataSource="data.leads" :columns="columns" :pagination="false">
          <template #bodyCell="{ column, record }: { column: IColumn, record: ILead }">
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
  </TheLayout>
</template>
