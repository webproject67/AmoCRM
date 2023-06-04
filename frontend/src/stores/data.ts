import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { useSearchTextStore, useLoadingStatusStore } from './index'
import type { IData } from '../types'

export const useDataStore = defineStore('data', () => {
  const searchTextStore = useSearchTextStore()
  const loadingStatusStore = useLoadingStatusStore()

  const data: Ref<IData> = ref({ leads: [], pipelines: [], users: [] })

  function setData(): void {
    loadingStatusStore.setLoaded(true)

    fetch(`http://localhost:3000/api/leads?query=${searchTextStore.searchText}`, {
      headers: { 'Content-type': 'application/json' }
    })
      .then((res) => res.json())
      .then((response: IData) => {
        const { leads, pipelines, users } = response

        const updatedLeads = leads.map((lead: object, i: number) => ({ ...lead, key: i }))

        data.value = { leads: updatedLeads, pipelines, users }

        loadingStatusStore.setLoaded(false)
      })
      .catch((error) => {
        console.log('Looks like there was a problem: \n', error)
      })
  }

  return { data, setData }
})
