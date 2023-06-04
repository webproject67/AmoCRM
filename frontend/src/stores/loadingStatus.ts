import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoadingStatusStore = defineStore('loadingStatus', () => {
  const isLoaded = ref(false)

  function setLoaded(value: boolean): void {
    isLoaded.value = value
  }

  return { isLoaded, setLoaded }
})
