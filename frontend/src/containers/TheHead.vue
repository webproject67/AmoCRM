<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { SearchOutlined, LoadingOutlined, WarningOutlined } from '@ant-design/icons-vue'
import TheTooltip from '../components/TheTooltip.vue'
import TextField from '../components/TextField.vue'
import { useSearchTextStore, useLoadingStatusStore, useWarningStatusStore } from '../stores/index'

const { searchText } = storeToRefs(useSearchTextStore())
const { isLoaded } = storeToRefs(useLoadingStatusStore())
const { isWarned } = storeToRefs(useWarningStatusStore())
</script>

<template>
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
</template>
