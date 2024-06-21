import { ref } from "vue";
import { defineStore } from "pinia";
import { Toastify } from '@/stores/utils'
import userData from '@/assets/data/api.json'

export const useMainStore = defineStore("MainStore", () => {

  const visible = ref(false);
  const users = ref();
  const getUsers = async() => {
    debugger
    try {
      const response = await new Promise((res, rej) => {
        rej("Хрень")
      })//JSON.parse(JSON.stringify({userData}))
      debugger
      console.log(response)
      // users.value = response.results
    } catch (e) {
      Toastify("Ошибка при разборе данных", "error")
    }
  }

  return { visible, users, getUsers};
});
