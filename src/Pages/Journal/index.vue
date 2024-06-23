<script setup lang="ts">
import { computed, ComputedRef, onMounted, reactive, Ref, ref, watch } from 'vue'
import qs from "query-string";
import { RouterLink } from 'vue-router'
import PageInfoJournalHeader from '@/components/PageInfo/PageInfoJournalHeader.vue'
import Search from './Search.vue'
import Footer from './Footer.vue'
import { merge, range } from "lodash";
import Table from '@/Pages/Journal/Table/Table.vue'
import TableHeader from '@/Pages/Journal/Table/TableHeader.vue'
import { useMainStore, UserCharacteristics } from '@/stores/store'
import { SortedBlock } from '@/Pages/Journal/index.types'
import { arrow } from '@/assets/constants/tableConstants'
import moment from 'moment'
import { dateComparison } from '@/Pages/Journal/utils/dateComparison'


const store = useMainStore();

const pgnData = reactive({
  pageNum: 1,
  size: 20
});
const data = ref({
  maxPage: 20,
  totalCount: 15,
})
const dateOfBirth = "dob";
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
// const setCurrentPage = (page: number | string, mounted: boolean) => {
//   if (pgnData.pageNum === page) return;
//   const currentParams = { ...router.currentRoute.query };
//   delete currentParams.pageNum;
//   delete currentParams.size;
//   pgnData.pageNum = Number(page);
//
//   if (!mounted) {
//     if (route.query.size) {
//       const path: RouteLocationRaw = {
//         query: currentParams
//       };
//       router.replace(path);
//
//       return;
//     }
//     const path: RouteLocationRaw = { query: { pageNum: String(page), ...currentParams } };
//     router.replace(path);
//   }
// };
// const handleSizeChange = (size: number, mounted: boolean): void => {
//   if (pgnData.size === size) return;
//   const currentParams = { ...router.currentRoute.query };
//   delete currentParams.pageNum;
//   delete currentParams.size;
//   pgnData.size = size;
//
//   if (!mounted) {
//     if (route.query.pageNum) {
//       pgnData.pageNum = 1;
//       const path: RouteLocationRaw = { query: { pageNum: "1", size: String(size), ...currentParams } };
//       router.replace(path);
//
//       return;
//     }
//
//     const path: RouteLocationRaw = { query: { size: String(size), ...currentParams } };
//     router.replace(path);
//   }
// };
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
const users: ComputedRef<UserCharacteristics[]> = computed(() => store.users)
const userData: Ref<UserCharacteristics[]> = ref([]);

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
}
const handleSort = (block: SortedBlock) => {
  debugger
  if (block.arrow === arrow.none) {
    userData.value = JSON.parse(JSON.stringify(users.value))
    return
  }
  const newUsers = userData.value.sort((a, b) => {
    if (block.sortField === dateOfBirth) {
      debugger
      // const sorted = dateComparison({ first: a, next: b, block})
      // return sorted

      const momentA = moment(a[block.sortField], "Do MMMM YYYY")
      const momentB = moment(b[block.sortField], "Do MMMM YYYY")
      if (block.arrow === arrow.up) {
        if (moment(momentA).isBefore(momentB)) {
          return 1;
        }
        if (moment(momentA).isAfter(momentB)) {
          return -1;
        }
        if (moment(momentA).isSame(momentB)) {
          return 0;
        }
      } else if (block.arrow === arrow.down) {
        if (moment(momentA).isBefore(momentB)) {
          return -1;
        }
        if (moment(momentA).isAfter(momentB)) {
          return 1;
        }
        if (moment(momentA).isSame(momentB)) {
          return 0;
        }
      } else {
        return 0
      }
    } else {
      if (block.arrow === arrow.up) {
        if (a[block.sortField] < b[block.sortField]) {
          return -1;
        }
        if (a[block.sortField] > b[block.sortField]) {
          return 1;
        }
      } else if (block.arrow === arrow.down) {
        if (a[block.sortField] < b[block.sortField]) {
          return 1;
        }
        if (a[block.sortField] > b[block.sortField]) {
          return -1;
        }
      } else return 0
    }
  })
  userData.value = newUsers
}
onMounted(()=> {
  store.getUsers()
})
watch(()=> users.value, (newVal) => {
  debugger
  console.log(newVal)
  userData.value = newVal.length ? JSON.parse(JSON.stringify(newVal)) : []
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
      <Table :tableData='userData' />
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
