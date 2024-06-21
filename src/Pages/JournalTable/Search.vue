<script setup lang="ts">
import { useMainStore } from '@/stores/store'

const search = useMainStore();
</script>

<template>
  <div v-show="search.visible">
    А здесь мы будем искать
  </div>
</template>

<style scoped>

</style>