<script setup lang='ts'>

import { defineEmits, defineProps, ref } from 'vue'
import type { Ref } from 'vue'
import type { ColumnHeadings, SortPackNameType, TriangleViewType } from '@/Pages/Journal/index.types'
import Sorting from '@/components/Sorting/Sorting.vue'
import { arrow } from '@/assets/constants/tableConstants'

const props = defineProps<{columnHeadings: ColumnHeadings}>()
const emit = defineEmits(["handleSort"]);

const columnHeadings: Ref<ColumnHeadings> = ref(props.columnHeadings)
const handleSort = (block: {sortField: SortPackNameType, arrow: TriangleViewType}) => {
  emit("handleSort", { sortField: block.sortField, arrow: block.arrow })
  columnHeadings.value.forEach((el) => {
    if (el.sortField === block.sortField) {
      el.arrow = block.arrow
    } else {
      el.arrow = arrow.none
    }
  })
}
</script>

<template>
  <div class="wrapper">
    <div v-for="column in columnHeadings" class="column" :key="`${column.headings}`">
        <span :class="['column-name', column.sortField]">{{column.headings}}</span>
        <Sorting :property="column" @handleSort="handleSort"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: grid;
  grid-template-columns: 2fr 3fr 2fr 2fr 3fr 5fr auto;
  padding: 5px 60px 5px 10px;
  background-color: $primary100;
  .column {
    display: flex;
    min-width: 100px;
    padding: 5px 10px;
    align-items: center;
    cursor: pointer;

    &:hover {
      .sort-wrapper {
        opacity: 1;
        transition: opacity 0.4s ease-in-out;
      }
    }
    .column-name {
      font-size: 18px;
    }
  }
}
.email {
  min-width: 230px;
}
</style>
