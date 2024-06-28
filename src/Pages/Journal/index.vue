<script setup lang="ts">
import { computed, onMounted, type Reactive, reactive, ref, watch } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import PageInfoJournalHeader from '@/components/PageInfo/PageInfoJournalHeader.vue'
import Search from './Search.vue'
import Footer from './Footer.vue'
import Table from '@/Pages/Journal/Table/Table.vue'
import TableHeader from '@/Pages/Journal/Table/TableHeader.vue'
import { useMainStore } from '@/stores/store'

import { arrow } from '@/assets/constants/tableConstants'
import { dateComparison } from '@/Pages/Journal/utils/dateComparison'
import type { ColumnHeadings, SortedBlock, UserCharacteristics } from '@/Pages/Journal/index.types'
import { stringComparison } from '@/Pages/Journal/utils/stringComparison'
import { useRoute, useRouter } from 'vue-router'
import type {RouteLocationRaw, Router } from 'vue-router'

const route = useRoute();
const router: Router = useRouter();
const store = useMainStore();

const startPage = 1;
const startSize = 20;
const dateOfBirth = "dob";
const initialColumnHeadings: ColumnHeadings = [
  { headings: "Аватар ", sortField: "none", arrow: "none" },
  { headings: "ФИО", sortField: "fullName", arrow: "none" },
  { headings: "Пол", sortField: "gender", arrow: "none" },
  { headings: "Страна", sortField: "country", arrow: "none" },
  { headings: "Дата рождения", sortField: "dob", arrow: "none" },
  { headings: "Адрес электронной почты", sortField: "email", arrow: "none" },
  { headings: "Телефон", sortField: "phone", arrow: "none" }
]

const pgnData = reactive({ pageNum: startPage, size: startSize });

const users:  ComputedRef<UserCharacteristics[]> = computed(() => store.users)
const userData: Ref<UserCharacteristics[]> = ref([]);
const tableData: Ref<UserCharacteristics[]> = ref([])
const userDataBeforeSorting: Ref<UserCharacteristics[]> = ref([]);
const columnHeadings: Reactive<ColumnHeadings> = reactive(initialColumnHeadings)

const maxPage = computed(() => Math.ceil(userData.value?.length / pgnData.size))
const total = computed(() => userData.value.length)

const handleChangeVisibleFilter = () => {
  store.setFilterVisibility();
};
const handleCurrentChange = (val: number) => {
  pgnData.pageNum = val;
};
const setCurrentPage = (page: number | string, mounted: boolean) => {
  if (pgnData.pageNum === page) return;
  const currentParams = { ...router.currentRoute.value.query };
  delete currentParams.pageNum;
  pgnData.pageNum = Number(page);

  if (!mounted) {
    if (route.query.size) {
      const path: RouteLocationRaw = {
        query: { pageNum: String(page), ...currentParams }
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
  const currentParams = { ...router.currentRoute.value.query };
  currentParams.pageNum = startPage.toString();
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
  columnHeadings.forEach((el) => el.arrow = arrow.none)
  upDateTable();
}

const handleSort = (block: SortedBlock) => {
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
    pgnData.pageNum = route.query.pageNum ? +route.query.pageNum : pgnData.pageNum
    pgnData.size = route.query.size ? +route.query.size : pgnData.size
    setTableData(JSON.parse(JSON.stringify(newVal)));
  }
  userData.value = newVal.length ? JSON.parse(JSON.stringify(newVal)) : []
})

watch(() => route.query.pageNum, () => {
    setTableData();
})
watch(() => route.query.size, () => {
  setTableData();
})
</script>

<template>
  <main>
    <div class="page-wrapper">
      <div class="top-panel">
        <PageInfoJournalHeader title="Таблица пользователей" @filter="handleChangeVisibleFilter" />
        <Search @lookThrough='lookThrough'/>
      </div>
      <TableHeader :columnHeadings="columnHeadings" @handleSort="handleSort"/>
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
