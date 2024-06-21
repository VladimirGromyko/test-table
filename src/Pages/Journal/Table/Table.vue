<script setup lang='ts'>
import { computed, defineProps } from 'vue'
import moment from "moment";

const props = defineProps({
  tableData: { type: Array, required: true }
})
const fullName = (user) => {
  debugger
  return `${user.name.title} ${user.name.first} ${user.name.last}`
}
debugger
console.log(props.tableData)
</script>

<template>
  <div v-for='(user, index) in tableData'>
    <div :key='`${index}-user`'>
        <div class='packsStyle.itemsLongName'>
          <img :src="user.picture.medium" alt="" />
        </div>
        <div class='packsStyle.itemsLongName'>{{fullName(user)}}</div>
        <div class='packsStyle.item'>{{ user.gender }}</div>
        <div class='packsStyle.item'>{{ user.location.country }}</div>
        <div class='packsStyle.item'>{{ moment(user.dob.date ).format('Do MMMM YYYY') }}</div>
        <div class='packsStyle.item'>{{ user.email }}</div>
        <div class='packsStyle.item'>{{ user.phone }}</div>
    </div>
  </div>

</template>



<style scoped>

</style>
