<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import qs from "query-string";
import { RouterLink } from 'vue-router'
import PageInfoJournalHeader from '@/components/PageInfo/PageInfoJournalHeader.vue'
import Search from './Search.vue'
import Footer from './Footer.vue'
import { merge, range } from "lodash";
import { useMainStore } from '@/stores/store'

const store = useMainStore();

const pgnData = reactive({
  pageNum: 1,
  size: 20
});
const data = ref({
  maxPage: 20,
  totalCount: 15,
})
const searchQueryParams = () => {
  const query: Record<string, any> = {};
  if (pgnData.size) {
    query.size = pgnData.size;
  }
  if (pgnData.pageNum) {
    query.pageNum = pgnData.pageNum;
  }
  const filter = store.searchString ? `&${store.searchString}` : "";

  return `?${qs.stringify(query)}${filter}`;
};
const handleChangeVisibleFilter = () => {
  store.visible = !store.visible;
};
const handleCurrentChange = (val: number) => {
  pgnData.pageNum = val;
};
const setCurrentPage = (page: number | string, mounted: boolean) => {
  if (pgnData.pageNum === page) return;
  const currentParams = { ...router.currentRoute.query };
  delete currentParams.pageNum;
  delete currentParams.size;
  pgnData.pageNum = Number(page);

  if (!mounted) {
    if (route.query.size) {
      const path: RouteLocationRaw = {
        query: currentParams
      };
      router.replace(path);

      return;
    }
    const path: RouteLocationRaw = { query: { pageNum: String(page), ...currentParams } };
    router.replace(path);
  }
};
const handleSizeChange = (size: number, mounted: boolean): void => {
  if (pgnData.size === size) return;
  const currentParams = { ...router.currentRoute.query };
  delete currentParams.pageNum;
  delete currentParams.size;
  pgnData.size = size;

  if (!mounted) {
    if (route.query.pageNum) {
      pgnData.pageNum = 1;
      const path: RouteLocationRaw = { query: { pageNum: "1", size: String(size), ...currentParams } };
      router.replace(path);

      return;
    }

    const path: RouteLocationRaw = { query: { size: String(size), ...currentParams } };
    router.replace(path);
  }
};
const pageCounts = computed(() =>
  data.value ? range(data.value?.numFirstElement, data.value?.numLastElement + 1) : []
);
const tableData = computed(() =>
  data.value && pageCounts.value?.length
    ? merge(
      data.value?.content,
      pageCounts.value.map((item) => ({ numeration: item }))
    )
    : []
);

const userData = computed(() => {
  debugger
  const data = store.users
  console.log(data)
  return data?.length ? data : []
})
onMounted(()=> {
  store.getUsers()
})

</script>

<template>
  <div class="page-wrapper">
    <RouterLink to="/">Вернуться в начало</RouterLink>
    <div class="top-panel">
      <PageInfoJournalHeader title="Таблица пользователей" @filter="handleChangeVisibleFilter" />
      <Search />
    </div>
    <div>
      Пользователи:
      <div v-for="(user, index) in userData" >
        <div :key="`${index}-user`">{{user}}</div>

      </div>
    </div>
<!--    <JournalTable />-->
    <Footer
      :max-page="data?.maxPage ?? 0"
      :current-page="pgnData.pageNum"
      :current-size="pgnData.size"
      :total="data?.totalCount ?? 0"
      @current="handleCurrentChange"
      @page="setCurrentPage"
      @size="handleSizeChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
}
.top-panel {
  border-bottom: 1px solid $neutral150;
}

</style>