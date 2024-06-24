<script setup lang="ts">
import { computed, type ComputedRef, onMounted, reactive, type Ref, ref, watch } from 'vue'
import PageInfoJournalHeader from '@/components/PageInfo/PageInfoJournalHeader.vue'
import Search from './Search.vue'
import Footer from './Footer.vue'
import { merge, range } from 'lodash'
import Table from '@/Pages/Journal/Table/Table.vue'
import TableHeader from '@/Pages/Journal/Table/TableHeader.vue'
import { useMainStore } from '@/stores/store'

import { arrow } from '@/assets/constants/tableConstants'
import { dateComparison } from '@/Pages/Journal/utils/dateComparison'
import type { SortedBlock, UserCharacteristics } from '@/Pages/Journal/index.types'
import { stringComparison } from '@/Pages/Journal/utils/stringComparison'
import { type RouteLocationRaw, type Router, useRoute, useRouter } from 'vue-router'

const route = useRoute();
const router: Router = useRouter();
const store = useMainStore();

const startPage = 1;
const startSize = 20;
const dateOfBirth = "dob";
const pgnData = reactive({
  pageNum: startPage,
  size: startSize,
});
// const data = ref({
//   maxPage: 20,
//   totalCount: 15,
// })

// const currentPage = computed(() => {
//   const aa = route.query.pageNum
//   debugger
//   return route.query.pageNum
//   // return router.currentRoute.value.query
// })
// const searchQueryParams = () => {
//   const query: Record<string, any> = {};
//   if (pgnData.size) {
//     query.size = pgnData.size;
//   }
//   if (pgnData.pageNum) {
//     query.pageNum = pgnData.pageNum;
//   }
//   const filter = store.searchString ? `&${store.searchString}` : "";
//
//   return `?${qs.stringify(query)}${filter}`;
// };
const filterVisible = computed(() => store.visible)
const handleChangeVisibleFilter = () => {
  store.visible = !store.visible;
};
const handleCurrentChange = (val: number) => {
  pgnData.pageNum = val;
};
const setCurrentPage = (page: number | string, mounted: boolean) => {
  if (pgnData.pageNum === page) return;
  debugger
  const currentParams = { ...router.currentRoute.value.query };
  delete currentParams.pageNum;
  // delete currentParams.size;
  pgnData.pageNum = Number(page);

  if (!mounted) {
    if (route.query.size) {
      const path: RouteLocationRaw = {
        query: { pageNum: String(page), ...currentParams }
        // query: currentParams
      };
      router.replace(path);

      return;
    }
    const path: RouteLocationRaw = { query: { pageNum: String(page), ...currentParams } };
    router.replace(path);
  }
};
const handleSizeChange = (size: number, mounted: boolean): void => {
  debugger
  if (pgnData.size === size) return;
  const currentParams = { ...router.currentRoute.value.query };
  currentParams.pageNum = startPage.toString();
  // delete currentParams.pageNum;
  delete currentParams.size;
  pgnData.size = size;

  if (!mounted) {
    if (route.query.pageNum) {
      pgnData.pageNum = startPage;
      const path: RouteLocationRaw = { query: { pageNum: startPage.toString(), size: String(size), ...currentParams } };
      router.replace(path);
      return;
    }
    const path: RouteLocationRaw = { query: { size: String(size), ...currentParams } };
    router.replace(path);
  }
};


const users:  ComputedRef<UserCharacteristics[]> = computed(() => store.users)
const userData: Ref<UserCharacteristics[]> = ref([]);
const userDataBeforeSorting: Ref<UserCharacteristics[]> = ref([]);


const maxPage = computed(() => Math.ceil(userData.value?.length / pgnData.size))
const total = computed(() => userData.value.length)
const pageCounts = computed(() => {
  const numFirstElement = 1;
  const numLastElement = Math.ceil(userData.value?.length / pgnData.size);
  return userData.value && numFirstElement ? range(numFirstElement, numLastElement + 1) : []
});

const tableData: Ref<UserCharacteristics[]> = ref([])

const setTableData = (data?: UserCharacteristics[]) => {

  let newData: UserCharacteristics[] = []
  const startElement = pgnData.size * (pgnData.pageNum - 1);
  const endElement = pgnData.size * (pgnData.pageNum) - 1;

  if (data?.length) {
    newData = JSON.parse(JSON.stringify(data))
    userDataBeforeSorting.value = JSON.parse(JSON.stringify(data))
    userData.value = newData
  }  else {
    newData = userData.value
  }
  tableData.value = newData.slice(startElement, Math.min(endElement, newData.length))
}


const upDateTable = () => {
  if (route.query?.pageNum) {
    router.replace({ query: {pageNum: startPage.toString(), size: route.query?.size} });
    if (route.query?.pageNum === startPage.toString()) {
      setTableData()
    }
  } else {
    setTableData()
  }
}
const lookThrough = (value: string) => {
  debugger
  const newData = users.value.filter((el) => {
    let check = false
    const userFieldKeys = Object.keys(el)
    for (let i = 0; i < userFieldKeys.length; i++) {
      const item = userFieldKeys[i]
      if(item !== "picture") {
        check = el[item].includes(value)
        if (check) {
          break
        }
      }
    }
    return check
  })
  userData.value = newData
  pgnData.pageNum = startPage;
  userDataBeforeSorting.value = JSON.parse(JSON.stringify(userData.value))
  upDateTable();
}

const handleSort = (block: SortedBlock) => {
  debugger
  if (block.arrow === arrow.none) {
    userData.value = JSON.parse(JSON.stringify(userDataBeforeSorting.value))
    upDateTable();
    return
  }
  userData.value = userData.value.sort((current, next): number => {
    if (block.sortField === dateOfBirth) {
      return dateComparison({ current, next, block })
    }
    return stringComparison({ current, next, block })
  })
  pgnData.pageNum = startPage;
  upDateTable();
}
onMounted(()=> {
  store.getUsers()
})
watch(()=> users.value, (newVal) => {
  if (newVal.length) {
    debugger
    pgnData.pageNum = route.query.pageNum ? +route.query.pageNum : pgnData.pageNum
    pgnData.size = route.query.size ? +route.query.size : pgnData.size
    setTableData(JSON.parse(JSON.stringify(newVal)));
  }
  userData.value = newVal.length ? JSON.parse(JSON.stringify(newVal)) : []
})

watch(() => route.query.pageNum, (newVal) => {
    setTableData();
})
</script>

<template>
  <main>
    <div class="page-wrapper">
      <div class="top-panel">
        <PageInfoJournalHeader title="Таблица пользователей" @filter="store.setFilterVisibility" />
        <Search @lookThrough='lookThrough'/>
      </div>
      <TableHeader @handleSort="handleSort"/>
      <Table :tableData='tableData' />
      <Footer
        :max-page="maxPage ?? 0"
        :current-page="pgnData.pageNum"
        :current-size="pgnData.size"
        :total="total ?? 0"
        @current="handleCurrentChange"
        @page="setCurrentPage"
        @size="handleSizeChange"
      />
    </div>
  </main>

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
