<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import TheLayout from './components/TheLayout.vue'
import TheHead from './containers/TheHead.vue'
import LeadList from './containers/LeadList.vue'
import { useDataStore, useSearchTextStore, useWarningStatusStore } from './stores/index'

const dataStore = useDataStore()
const warningStatusStore = useWarningStatusStore()
const { searchText } = storeToRefs(useSearchTextStore())

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
    <TheHead />
    <LeadList />
  </TheLayout>
</template>
