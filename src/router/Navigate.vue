<script setup lang='ts'>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/">Главная</RouterLink>
    <RouterLink to="/table">Таблица</RouterLink>
  </nav>
</template>

<style scoped lang='scss'>
nav {
  min-height: 40px;
  display: flex;
  //justify-content: center;
  padding-left: 3rem;
  align-items: center;
  gap: 3rem;
  background-color: $neutral50;
}
</style>
