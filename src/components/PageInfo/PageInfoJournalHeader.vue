<template>
  <div class="button-wrapper">
    <div class="wrapper">
      <h1>{{ title }}</h1>
      <slot />
    </div>
<!--    <button class="filter-btn" variant="accent" @click="handleClickFilter">-->
    <button class="filter-btn" @click="handleClickFilter">
      <FilterIcon width="10" height="10" class="icon-filter" />Фильтр
    </button>
  </div>
</template>

<script setup lang="ts">
import FilterIcon from "@/assets/image/filter.svg";

defineProps<{
  title: string;
}>();
const emit = defineEmits(["filter"]);
const handleClickFilter = () => {
  emit("filter");
};
</script>
<style lang="scss" scoped>
.button-wrapper {
  @include pad;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  color: $neutral700;
  font-size: 24px;
  font-weight: bold;

  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  .filter-btn {
    height: 30px;
  }
}
.icon-filter {
  margin-right: 5px;
  :deep(path) {
    fill: $primary600;
  }
}
</style>
