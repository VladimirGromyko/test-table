<script setup lang="ts">
import VuePagination from "@/components/Pagination/Pagination.vue";
import { defineProps, defineEmits } from "vue"

defineProps<{
  maxPage: number;
  currentPage: number;
  currentSize: number;
  total: number;
}>();

const emit = defineEmits(["size", "current", "page"]);

const emitPage = (value) => {
  emit("page", value);
};

const emitCurrent = (value) => {
  emit("current", value);
};

const emitSize = (value) => {
  emit("size", value);
};
</script>

<template>
  <footer class="page-footer">
    <VuePagination
      :current-page="currentPage"
      :max-page="maxPage"
      :current-size="currentSize"
      :total="total"
      @page="emitPage"
      @current="emitCurrent"
      @size="emitSize"
    />
  </footer>
</template>

<style lang="scss" scoped>
.page-footer {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  min-height: 72px;
  padding: 20px 40px;
  background-color: $primary100;
}
</style>
