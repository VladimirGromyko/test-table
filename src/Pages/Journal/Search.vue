<script setup lang="ts">
import { useMainStore } from '@/stores/store'
import { Ref, ref } from 'vue'
import { defineEmits } from 'vue'

const emit = defineEmits(['lookThrough'])

const search = useMainStore();
const searchString: Ref<string> = ref('')


const handleInput = () => {
  debugger
  emit('lookThrough',  searchString.value.trim());
}

</script>

<template>
  <div v-show="search.visible">
    <div>А сейчас поищем что-нибудь</div>
    <input v-model='searchString' @input='handleInput' type='text'>
  </div>
</template>

<style scoped>

</style>
