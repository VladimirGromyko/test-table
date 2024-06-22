<script setup lang='ts'>

import { ref, Ref } from 'vue'
import Sorting from '@/components/Sorting/Sorting.vue'

type triangleViewType = 'none' | 'down' | 'up'
type SortPackNameType = 'name' | 'cardsCount' | 'updated' | 'user_name' | 'actions' | 'none'
export type HeadingsElement = {
  headings: string,
  sortField: SortPackNameType
  arrow: triangleViewType
}
type ColumnHeadings = HeadingsElement[]

const initialColumnHeadings: ColumnHeadings = <HeadingsElement[]>[
  { headings: "Аватар ", sortField: "none", arrow: "none" },
  { headings: "ФИО", sortField: "user_name", arrow: "none" },
  { headings: "Пол", sortField: "gender", arrow: "none" },
  { headings: "Страна", sortField: "country", arrow: "none" },
  { headings: "Дата рождения", sortField: "dob", arrow: "none" },
  { headings: "Адрес электронной почты", sortField: "email", arrow: "none" },
  { headings: "Телефон", sortField: "phone", arrow: "none" }
]

const columnHeadings: Ref<ColumnHeadings> = ref(initialColumnHeadings)

</script>

<template>
  <div class="wrapper">
    <div v-for="column in columnHeadings" class="column" :key="`${column.headings}`">
<!--      <div>-->
        <span :class="['column-name', column.sortField]">{{column.headings}}</span>
        <Sorting :property="column"/>
<!--      </div>-->
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
