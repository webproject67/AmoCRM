<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue'
import {
  SearchOutlined,
  WarningOutlined,
  LoadingOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons-vue'

interface IData {
  leads: object[]
  pipelines: IPipeline[]
  users: IUser[]
}

interface IPipeline {
  id: number
  _embedded: {
    statuses: {
      id: number
      name: string
      color: string
    }[]
  }
}

interface IUser {
  id: number
  name: string
}

const columns = [
  {
    title: 'Название',
    dataIndex: 'name',
    key: 'name',
    width: '40%'
  },
  {
    title: 'Статус',
    dataIndex: 'status_id',
    key: 'status_id',
    width: '15%'
  },
  {
    title: 'Ответственный',
    dataIndex: 'responsible_user_id',
    key: 'responsible_user_id',
    width: '15%'
  },
  {
    title: 'Дата создания',
    dataIndex: 'created_at',
    key: 'created_at',
    width: '15%',
    align: 'center'
  },
  {
    title: 'Бюджет',
    dataIndex: 'price',
    key: 'price',
    width: '15%',
    align: 'center'
  }
]

const isWarned = ref(false)
const isLoaded = ref(false)
const searchText = ref('')
const data: Ref<IData> = ref({ leads: [], pipelines: [], users: [] })

const getData = (): void => {
  isLoaded.value = true

  fetch(`http://localhost:3000/api/leads?query=${searchText.value}`, {
    headers: { 'Content-type': 'application/json' }
  })
    .then((res) => res.json())
    .then((response: IData) => {
      const { leads, pipelines, users } = response

      const updatedLeads = leads.map((lead: object, i: number) => ({ ...lead, key: i }))

      data.value = { leads: updatedLeads, pipelines, users }

      isLoaded.value = false
    })
    .catch((error) => {
      console.log('Looks like there was a problem: \n', error)
    })
}

const changeSearchText = (event: Event): void => {
  const value = (event.target as HTMLInputElement).value

  if (value.length >= 3 || value.length === 0) {
    isWarned.value = false
    searchText.value = value
    getData()
    return
  }

  isWarned.value = true
}

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

onMounted(() => getData())
</script>

<template>
  <a-layout>
    <a-layout-content>
      <a-card title="Пример тестового задания">
        <template #extra>
          <a-tooltip v-if="isWarned" title="Поиск работает от 3 символов">
            <warning-outlined />
          </a-tooltip>
          <a-input v-on:input="changeSearchText" placeholder="Поиск сделок" autofocus>
            <template #suffix>
              <a-tooltip>
                <search-outlined v-if="!isLoaded" />
                <loading-outlined v-else />
              </a-tooltip>
            </template>
          </a-input>
        </template>
      </a-card>
      <a-spin :spinning="isLoaded">
        <a-card>
          <a-table :dataSource="data.leads" :columns="columns" :pagination="false">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'responsible_user_id'">
                <a-avatar size="small">
                  <template #icon><UserOutlined /></template>
                </a-avatar>
                {{ getResponsibleUser(record.responsible_user_id) }}
              </template>
              <template v-if="column.key === 'status_id'">
                <a-tag :color="getStatus(record.pipeline_id, record.status_id)">
                  {{ getStatus(record.pipeline_id, record.status_id, 'text') }}
                </a-tag>
              </template>
              <template v-if="column.key === 'created_at'">
                {{ localeDate(record.created_at) }}
              </template>
              <template v-if="column.key === 'price'">
                {{ numberFormat(record.price) }}
              </template>
            </template>
            <template #expandedRowRender="{ record }">
              <template v-for="contact in record.contacts" :key="contact">
                <p class="contacts">
                  <a-avatar size="small">
                    <template #icon>
                      <UserOutlined />
                    </template>
                  </a-avatar>
                  {{ contact.name }}
                  <template
                    v-for="communication in contact.custom_fields_values"
                    :key="communication"
                  >
                    <template v-if="communication.field_code === 'PHONE'">
                      <template v-for="phone in communication.values" :key="phone">
                        <a-divider type="vertical" />
                        <a :href="'tel:' + phone.value">
                          <a-tooltip>
                            <phone-outlined />
                          </a-tooltip>
                        </a>
                      </template>
                    </template>
                    <template v-if="communication.field_code === 'EMAIL'">
                      <template v-for="email in communication.values" :key="email">
                        <a-divider type="vertical" />
                        <a :href="'mailto:' + email.value">
                          <a-tooltip>
                            <mail-outlined />
                          </a-tooltip>
                        </a>
                      </template>
                    </template>
                  </template>
                </p>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-spin>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
.ant-layout {
  height: 100%;
}

.ant-layout-content {
  padding: 50px;
}

.anticon-warning {
  margin: 0 10px;
  color: red;
}

.ant-input-affix-wrapper {
  width: 300px;
}

.ant-avatar {
  margin-right: 8px;
}

.ant-tag {
  color: #000000;
}

.contacts {
  padding-left: 50px;
}

.anticon-phone {
  transform: rotate(90deg);
}
</style>
