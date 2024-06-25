<script setup lang='ts'>
import { computed, withDefaults, defineProps, defineEmits, ref, watch } from 'vue'

import ArrowSelect from '@/assets/image/arrow-select.svg'
import PaginationArrow from '@/assets/image/pagination-arrow.svg'

interface Props {
  maxPage: number;
  label?: string;
  currentPage: number;
  currentSize: number;
  total: number;
}
type NumbersListWithDots = string | number

const props = withDefaults(
  defineProps<Props>(),
  {
    maxPage: 1,
    label: 'Записей на странице',
    currentPage: 1,
    currentSize: 20,
    total: 0
  }
)

const $emit = defineEmits(['size', 'current', 'page'])

const isOpen = ref(false)
const viewItems = ref(20)

const getPaginationGenerator = (currentPageNumber: number, totalPageNumber: number, offset: number = 3) => {
  const offsetNumber =
    currentPageNumber <= offset || currentPageNumber > totalPageNumber - offset ? offset : offset - 1
  const numbersList: number[] = []
  const numbersListWithDots: NumbersListWithDots[] = []

  if (totalPageNumber <= 1 || totalPageNumber === undefined) return [1]

  numbersList.push(1)
  for (let i = currentPageNumber - offsetNumber; i <= currentPageNumber + offsetNumber; i++) {
    if (i < totalPageNumber && i > 1) {
      numbersList.push(i)
    }
  }
  numbersList.push(totalPageNumber)

  numbersList.reduce((accumulator: number, currentValue: number) => {
    if (accumulator === 1) {
      numbersListWithDots.push(accumulator)
    }
    if (currentValue - accumulator !== 1) {
      numbersListWithDots.push('...')
    }
    numbersListWithDots.push(currentValue)

    return currentValue
  })

  return numbersListWithDots
}
const pagination = computed(() => {
  return getPaginationGenerator(props.currentPage, props.maxPage)
})

const handleSelectSize = (size: number) => {
  viewItems.value = size
  isOpen.value = false
  $emit('size', size)
}

const handleSetPage = (item: number) => {
  const itemNumber = Number(item)
  if (!isNaN(itemNumber)) {
    $emit('current', props.currentPage)
    $emit('page', itemNumber)
  }
}

const handlePrevPage = () => {
  const prevPage = props.currentPage !== 1 ? props.currentPage - 1 : props.currentPage
  handleSetPage(prevPage)
}

const handleNextPage = () => {
  const nextPage: number = props.currentPage !== props.maxPage ? props.currentPage + 1 : props.currentPage
  handleSetPage(nextPage)
}

watch(
  () => props.currentSize,
  (value) => {
    viewItems.value = value
  }
)
</script>

<template>
  <div class='pagination-wrapper'>
    <div class='size-sheet-wrapper'>
      <div class='pagination-total'>
        <span>Всего</span>
        <span>{{ total }}</span>
      </div>
      <div class='size-sheet-container'>
        <button class='size-sheet' :class='{ open: isOpen }' @click='isOpen = !isOpen'>
          {{ viewItems }}
          <arrow-select class='arrow' :class='{ open: isOpen }' />
        </button>
        <div class='options' v-show='isOpen'>
          <button class='select-size-btn' @click='handleSelectSize(20)'>20</button>
          <button class='select-size-btn' @click='handleSelectSize(40)'>40</button>
          <button class='select-size-btn' @click='handleSelectSize(80)'>80</button>
        </div>
      </div>
      <span class='pagination-label'>{{ label }}</span>
    </div>
    <div class='pagination'>
      <button @click='handlePrevPage' class='pagination-btn'>
        <pagination-arrow class='left-arrow' />
      </button>
      <ul class='pagination-item-container'>
        <li class='pagination-item' v-for='(item, index) in pagination' :key='index'>
          <template v-if="typeof item === 'number'">
            <button
              @click='handleSetPage(item)'
              class='pagination-btn'
              :class="{ 'current-page': currentPage === item }"
            >{{ String(item) }}
            </button>
          </template>
          <template v-if="typeof item === 'string'">
            <span>{{ item }}</span>
          </template>
        </li>
      </ul>
      <button @click='handleNextPage' class='pagination-btn'>
        <pagination-arrow class='right-arrow' />
      </button>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.pagination-wrapper {
  display: flex;
  position: relative;
}

.size-sheet-wrapper {
  display: flex;
  align-items: center;
}

.size-sheet-container {
  position: relative;
}

.size-sheet {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 14px;
  transition: color 0.3s;
  border: none;
  border-radius: 4px;
  background-color: $white;
  box-shadow: 0 1px 4px rgba(26, 26, 67, 0.1);
  color: $neutral500;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    color: $neutral900;
  }
}

.select-size-btn {
  @include btn;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 8px 14px;
  font-weight: normal;
  transition: background-color 0.3s;
  color: $neutral800;

  &:hover {
    background-color: $primary100;
  }
}

.options {
  position: absolute;
  right: 0;
  bottom: 40px;
  width: 100%;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(33, 33, 52, 0.1);
}

.arrow {
  width: 10px;
  height: 5px;
  margin-left: 5px;

  :deep(path) {
    fill: $neutral400;
  }
}

.open {
  color: $primary700;

  &:hover {
    color: $primary700;
  }

  .arrow {
    transform: rotate(180deg);

    :deep(path) {
      fill: $primary700;
    }
  }
}

.pagination-label {
  display: block;
  margin-left: 10px;
  color: $neutral500;
  font-size: 13px;
}

.pagination {
  display: flex;
}

.left-arrow {
  width: 7px;
}

.right-arrow {
  width: 7px;
  transform: rotate(180deg);
}

.pagination-total {
  display: flex;
  gap: 10px;
  padding: 0 20px;
  color: #8E8EA9;
  font-size: 13px;
  font-weight: bold;
}

.pagination-item-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn {
  @include btn;
  width: 32px;
  height: 32px;
  font-weight: 500;
}

ul {
  padding-inline-start: 0;
}

.current-page {
  background-color: $white;
  color: $primary700;
}
</style>
