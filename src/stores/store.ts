// import { reactive, ref } from 'vue'

import { defineStore } from "pinia";
import { Toastify } from '@/stores/utils'
import userData from '@/assets/data/api.json'
import type { Ref } from 'vue'
import { ref } from 'vue'

export const useMainStore = defineStore("MainStore", () => {

  const visible = ref(false);
  const users: Ref<any[]> = ref([]);
  const getUsers = async() => {
    debugger
    try {
      const response =
        // await new Promise((res, rej) => {
        // rej("Хрень")
      // })
      JSON.parse(JSON.stringify(userData))
      debugger
      console.log(response)

      // TODO преобразовать массив

      users.value = response.results
    } catch (e) {
      Toastify("Ошибка при разборе данных", "error")
    }
  }

  return { visible, users, getUsers};
});
