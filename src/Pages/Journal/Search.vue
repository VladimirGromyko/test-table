<script setup lang="ts">
import { useMainStore } from '@/stores/store'
import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import { defineEmits } from 'vue'

const emit = defineEmits(['lookThrough'])

const search = useMainStore();
const visibility = computed(() => search.visible)
const searchString: Ref<string> = ref('')


const handleInput = () => {
  emit('lookThrough',  searchString.value.trim());
}

</script>

<template>
  <div v-show="visibility" class="wrapper">
    <input v-model='searchString' type='text'>
    <button @click='handleInput'>Поиск</button>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  padding: 10px 20px;
  input {
    @include SubExpand;
    :active, :hover, :focus {
      outline: 0;
      outline-offset: 0;
    }
  }
  button {
    font-size: 16px;
    font-weight: 500;
    margin-left: 10px;
    padding: 5px;
  }
}
</style>
