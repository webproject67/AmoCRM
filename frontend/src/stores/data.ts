import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { useSearchTextStore, useLoadingStatusStore } from './index'
import type { IData } from '../types'

export const useDataStore = defineStore('data', () => {
  const searchTextStore = useSearchTextStore()
  const loadingStatusStore = useLoadingStatusStore()

  const data: Ref<IData> = ref({ leads: [], pipelines: [], users: [] })

  async function setData(): Promise<void> {
    loadingStatusStore.setLoaded(true)

    const response = await fetch(
      `http://localhost:3000/api/leads?query=${searchTextStore.searchText}`,
      {
        headers: { 'Content-type': 'application/json' }
      }
    )

    if (response.ok) {
      const json: IData = await response.json()

      const { leads, pipelines, users } = json

      const updatedLeads = leads.map((lead: object, i: number) => ({ ...lead, key: i }))

      data.value = { leads: updatedLeads, pipelines, users }

      loadingStatusStore.setLoaded(false)

      return
    }

    console.log(response.status, response.statusText)
  }

  return { data, setData }
})

//? - нет использования async await
//
// Илья Кантор пишет можно без async await, с использованием промисов
// https://learn.javascript.ru/fetch
//
// Предыдущий код:
//
// fetch(`http://localhost:3000/api/leads?query=${searchTextStore.searchText}`, {
//   headers: { 'Content-type': 'application/json' }
// })
//   .then((res) => res.json())
//   .then((response: IData) => {
//     const { leads, pipelines, users } = response

//     const updatedLeads = leads.map((lead: object, i: number) => ({ ...lead, key: i }))

//     data.value = { leads: updatedLeads, pipelines, users }

//     loadingStatusStore.setLoaded(false)
//   })
//   .catch((error) => {
//     console.log('Looks like there was a problem: \n', error)
//   })
