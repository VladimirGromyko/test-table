import { defineStore } from 'pinia'
import userData from '@/assets/data/api.json'
import type { Ref } from 'vue'
import { ref } from 'vue'
import moment from 'moment'
import type { UserCharacteristics, UserGlobalCharacteristics } from '@/Pages/Journal/index.types'

export const useMainStore = defineStore("Main", () => {

  const visible = ref(false);
  const users: Ref<UserCharacteristics[]> = ref([]);

  const setFilterVisibility = () => {
    visible.value = !visible.value
  }
  const getUsers = async() => {
    try {
      const response = JSON.parse(JSON.stringify(userData));
      const results: UserGlobalCharacteristics[] = response.results;
      users.value = results.map((item) => {
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
    } catch (e) {
      console.log("Ошибка при разборе данных. Текст: ", e)
    }
  }

  return { visible, setFilterVisibility, users, getUsers};
});
