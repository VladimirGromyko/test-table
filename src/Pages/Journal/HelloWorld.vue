<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { defineProps } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <div>
    {{ msg }}
  </div>
  <RouterLink to="/table">Таблица</RouterLink>
</template>

<style scoped>

</style>
