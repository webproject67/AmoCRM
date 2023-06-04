import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useWarningStatusStore = defineStore('warningStatus', () => {
  const isWarned = ref(false)

  function setWarned(value: boolean): void {
    isWarned.value = value
  }

  return { isWarned, setWarned }
})
