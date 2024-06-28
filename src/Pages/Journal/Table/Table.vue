<script setup lang='ts'>
import { defineProps } from 'vue'
import type { UserCharacteristics } from '@/Pages/Journal/index.types'


interface Props {
  tableData: UserCharacteristics[]
}
const props = defineProps<Props>()
</script>

<template>
  <div class="table-wrapper">
    <div v-for='(user, index) in props.tableData'
         :key='`${index}-user`'
         class="items"
    >
      <div class="table-row">
        <div class="user-column">
          <img :src='user.picture' alt='' />
        </div>
        <div class="user-column">{{ user.fullName }}</div>
        <div class="user-column">{{ user.gender }}</div>
        <div class="user-column">{{ user.country }}</div>
        <div class="user-column">{{ user.dob }}</div>
        <div class="user-column e-mail">{{ user.email }}</div>
        <div class="user-column">{{ user.phone }}</div>
      </div>

    </div>
  </div>

</template>


<style scoped lang="scss">
.table-wrapper {
  max-height: 75vh;
  overflow-y: scroll;
  padding: 5px 0;
}
.items{
  :hover{
    background: $neutral150;
  }
}
.table-row {
  display: grid;
  grid-template-columns: 2fr 3fr 2fr 2fr 3fr 5fr auto;
  padding: 5px 60px 0 20px;
}
.user-column {
  display: flex;
  min-width: 100px;
  padding: 5px 10px;
  align-items: center;
  img {
    border-radius: 50%;
  }
}
.e-mail {
  min-width: 220px;
}
</style>
