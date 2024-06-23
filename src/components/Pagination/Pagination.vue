<template>
  <div class="pagination-wrapper">
    <div class="size-sheet-wrapper">
      <div class="pagination-total">
        <span>Всего</span>
        <span>{{total}}</span>
      </div>
      <div class="size-sheet-container">
        <button class="size-sheet" :class="{ open: isOpen }" @click="isOpen = !isOpen">
          {{ viewItems }}
          <arrow-select class="arrow" :class="{ open: isOpen }" />
        </button>
        <div class="options" v-show="isOpen">
          <VueButton class="select-size-btn" @click="handleSelectSize(20)" label="20" variant="text" />
          <VueButton class="select-size-btn" @click="handleSelectSize(40)" label="40" variant="text" />
          <VueButton class="select-size-btn" @click="handleSelectSize(80)" label="80" variant="text" />
        </div>
      </div>
      <span class="pagination-label">{{ label }}</span>
    </div>
    <div class="pagination">
      <VueButton variant="text" @click="handlePrevPage">
        <pagination-arrow class="left-arrow" />
      </VueButton>
      <ul class="pagination-item-container">
        <li class="pagination-item" v-for="(item, index) in pagination" :key="index">
          <template v-if="typeof item === 'number'">
            <VueButton
              @click="handleSetPage(item)"
              variant="text"
              class="pagination-btn"
              :class="{ 'current-page': currentPage === item }"
              :label="String(item)"
            />
          </template>
          <template v-if="typeof item === 'string'">
            <span>{{ item }}</span>
          </template>
        </li>
      </ul>
      <VueButton variant="text" @click="handleNextPage">
        <pagination-arrow class="right-arrow" />
      </VueButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import ArrowSelect from "@/assets/image/arrow-select.svg";
import PaginationArrow from "@/assets/image/pagination-arrow.svg";

const getPaginationGenerator = (currentPageNumber, totalPageNumber, offset = 3) => {
  const offsetNumber =
    currentPageNumber <= offset || currentPageNumber > totalPageNumber - offset ? offset : offset - 1;
  const numbersList = [];
  const numbersListWithDots = [];

  // If itemsPerPage is less than what the user selected with the Select component or if there is no page or only one page:
  if (totalPageNumber <= 1 || totalPageNumber === undefined) return [1];

  // Create list of numbers:
  numbersList.push(1);
  for (let i = currentPageNumber - offsetNumber; i <= currentPageNumber + offsetNumber; i++) {
    if (i < totalPageNumber && i > 1) {
      numbersList.push(i);
    }
  }
  numbersList.push(totalPageNumber);

  // Add three dots to the list of numbers:
  numbersList.reduce((accumulator, currentValue) => {
    if (accumulator === 1) {
      numbersListWithDots.push(accumulator);
    }
    if (currentValue - accumulator !== 1) {
      numbersListWithDots.push("...");
    }
    numbersListWithDots.push(currentValue);

    return currentValue;
  });

  return numbersListWithDots;
};

const props = withDefaults(
  defineProps<{
    maxPage: number;
    label?: string;
    currentPage: number;
    currentSize: number;
    total: number;
  }>(),
  {
    maxPage: 1,
    label: "Записей на странице",
    currentPage: 1,
    currentSize: 20,
    total: 0,
  }
);

const $emit = defineEmits(["size", "current", "page"]);

const isOpen = ref(false);
const viewItems = ref(20);

const pagination = computed(() => {
  return getPaginationGenerator(props.currentPage, props.maxPage);
});

const handleSelectSize = (size) => {
  viewItems.value = size;
  isOpen.value = false;
  $emit("size", size);
};

const handleSetPage = (item) => {
  const itemNumber = Number(item);
  if (!isNaN(itemNumber)) {
    $emit("current", props.currentPage);
    $emit("page", itemNumber);
  }
};

const handlePrevPage = () => {
  const prevPage = props.currentPage !== 1 ? props.currentPage - 1 : props.currentPage;
  handleSetPage(prevPage);
};

const handleNextPage = () => {
  const nextPage = props.currentPage !== props.maxPage ? props.currentPage + 1 : props.currentPage;
  handleSetPage(nextPage);
};

watch(
  () => props.currentSize,
  (value) => {
    viewItems.value = value;
  }
);
</script>

<style lang="scss" scoped>
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
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 8px 14px;
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

.pagination-total{
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
  width: 32px;
  height: 32px;
  font-weight: 500;
}

.current-page {
  background-color: $white;
  color: $primary700;
}
</style>