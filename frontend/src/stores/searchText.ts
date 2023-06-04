import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSearchTextStore = defineStore('searchText', () => {
  const searchText = ref('')

  return { searchText }
})
