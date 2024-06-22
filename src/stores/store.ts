// import { reactive, ref } from 'vue'

import { defineStore } from "pinia";
import { Toastify } from '@/stores/utils'
import userData from '@/assets/data/api.json'
import type { Ref } from 'vue'
import { ref } from 'vue'
import moment from 'moment'

export interface UserCharacteristics {
  picture: string,
  fullName: string,
  gender: string,
  country: string,
  dob: string,
  email: string,
  phone: string,
}

export const useMainStore = defineStore("Main", () => {

  const visible = ref(false);
  const setFilterVisibility = () => {
    visible.value = !visible.value
  }

  const users: Ref<UserCharacteristics[]> = ref([]);
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
      const data: UserCharacteristics[] = response.results.map((item) => {
        return {
          picture: item.picture.medium,
          fullName: `${item.name.title} ${item.name.first} ${item.name.last}`,
          gender: item.gender,
          country: item.location.country,
          dob: moment(item.dob.date).format('Do MMMM YYYY'),
          email: item.email,
          phone: item.phone,
        }
      })
      users.value = data
    } catch (e) {
      Toastify("Ошибка при разборе данных", "error")
    }
  }


  return { visible, setFilterVisibility, users, getUsers};
});
