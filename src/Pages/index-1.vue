<template>
  <div class="page-wrapper">
    <div class="top-panel">
      <PageInfoJournalHeader title="Журнал учёта специальных формуляров" @filter="handleChangeVisibleFilter">
        <ButtonsPanel @download="handleDownloadFiles" @handleHideColumn="handleHideColumn" />
      </PageInfoJournalHeader>
      <Search />
    </div>
    <JournalTable
      :tableData="tableData || null"
      :settings="tableSetting"
      :loading="isLoading"
      @handleInfoForm="(row) => handleViewFormul(row)"
      @setRow="(value) => handleSetRow(value)"
      @download="handleSetDownLoadFile"
    />
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

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import qs from "query-string";
import { type RouteLocationRaw, type Router, useRoute, useRouter } from "vue2-helpers/vue-router";
import useSWRV from "swrv";
import { assign, forEach, has, identity, isEmpty, isEqual, merge, pickBy, range } from "lodash";
import { useStore } from "vue2-helpers/vuex";

import { Toastify } from "@/vuex/main/utils";
import saveFile from "@/common/utils/filesaver.ts";
import { HTTPMethod } from "@/enums/HttpMethods.enum.ts";
import PageInfoJournalHeader from "@/components/PageInfo/PageInfoJournalHeader.vue";
import fetchFormular from "@/common/http/fetchers/formulars";
import fetchers from "@/common/http/fetchers";

import JournalTable from "./Table.vue";
import Search from "./Search.vue";
import Footer from "./Footer.vue";
import ButtonsPanel from "./ButtonsPanel.vue";
import { useSearch, type Form } from "./store.ts";

const route = useRoute();
const router = useRouter();
const search = useSearch();
const store = useStore();

const curRow = ref(null);
const downLoadFiles = ref([]);
const pgnData = reactive({
  pageNum: 1,
  size: 20
});

const tableSetting = reactive({
  index: { visible: true, label: "№" },
  formsNumDate: { visible: true, label: "Номер и дата создания" },
  formSpecialType: { visible: false, label: "Вид" },
  finOperMembers: { visible: true, label: "Участники финансовой операции" },
  operType: { visible: false, label: "Вид финансовой операции" },
  operEndDate: { visible: false, label: "Дата совершения финансовой операции" },
  termOfControlType: { visible: false, label: "Условия особого контроля" },
  suspicionSigns: { visible: false, label: "Признаки подозрительности" },
  price: { visible: false, label: "Сумма и валюта финансовой операции" },
  departureDate: { visible: true, label: "Дата направления" },
  receivingDate: { visible: true, label: "Дата получения" },
  receiptNumDate: { visible: true, label: "Дата и номер квитанции" },
  resultControl: { visible: true, label: "Результат контроля" },
  formNewNumDate: { visible: true, label: "Номер и дата заменяющего" },
  formOldNumDate: { visible: true, label: "Номер и дата замененного" },
  registratorInfo: { visible: false, label: "Регистратор, ТОР" }
});

const searchQueryParams = () => {
  const query: Record<string, any> = {};
  if (pgnData.size) {
    query.size = pgnData.size;
  }
  if (pgnData.pageNum) {
    query.pageNum = pgnData.pageNum;
  }
  const filter = search.searchString ? `&${search.searchString}` : "";

  return `?${qs.stringify(query)}${filter}`;
};

const { data, error } = useSWRV(searchQueryParams, fetchers.formulars, {
  errorRetryInterval: 3000
});

const isLoading = computed(() => !data && !error);
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

const applySearchParams = (search: Form, router: Router) => {
  const searchObject = pickBy(search, identity);
  const currentParams = { ...router.currentRoute.query };
  const mergedParams: Record<string, any> = {};

  forEach(currentParams, (value, key) => {
    if (["pageNum", "size"].includes(key) || has(searchObject, key)) {
      mergedParams[key] = value;
    }
  });

  if (!isEmpty(searchObject)) {
    assign(mergedParams, searchObject);
  }
  const hasChangedParams = !isEqual(mergedParams, currentParams);

  if (hasChangedParams) {
    router.push({ query: mergedParams });
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

onMounted(() => {
  const formularTable = localStorage.getItem("formularTable");

  if (formularTable) {
    Object.assign(tableSetting, JSON.parse(formularTable));
  }

  if (route.query.pageNum) {
    setCurrentPage(Number(route.query.pageNum), true);
  }
  if (route.query.size) {
    handleSizeChange(Number(route.query.size), true);
  }

  const currentParams = search.filterEmpty({ ...router.currentRoute.query });
  search.writeSearchParams(currentParams as Form);
});

watch(
  () => search.searchObject,
  (value) => {
    if (value) {
      applySearchParams(value, router);
    }
  }
);
watch(
  () => data.value?.maxPage,
  (value) => {
    if (value && value < pgnData.pageNum) {
      setCurrentPage(1, false);
    }
  }
);

const handleChangeVisibleFilter = () => {
  search.visible = !search.visible;
};
const handleSetRow = (val) => {
  curRow.value = val;
};
const handleCurrentChange = (val: number) => {
  pgnData.pageNum = val;
};
const handleSetDownLoadFile = (val) => {
  downLoadFiles.value = val;
};
const textParse = async (value) => {
  const text = await value.text();
  return JSON.parse(text);
};

const handleDownloadFiles = async () => {
  if (!downLoadFiles.value.length) {
    return Toastify("Выберите формуляры", "warning");
  }
  const formularsId = new URLSearchParams(downLoadFiles.value.map((item) => ["formId", item]));
  try {
    const response = await fetchFormular(`download?${formularsId.toString()}`, HTTPMethod.GET, null, {
      responseType: "blob"
    });
    saveFile(response);
  } catch (e) {
    if (e.response?.data.type === "application/json") {
      const dataText = await textParse(e.response.data);
      const error = dataText ? dataText.error : e.response?.statusText;
      Toastify(error, "error");
    } else if (e.response) {
      Toastify(e.response?.statusText, "error");
    } else if (e.data) {
      const dataText = await textParse(e.data);
      const error = dataText ? dataText.error : e.statusText;
      Toastify(error, "error");
    } else {
      Toastify(e.message, "error");
    }
  }
};

const handleViewFormul = (row) => {
  router.push(`/formulars/${row.id}?return`);
};

const handleHideColumn = async () => {
  await store.dispatch("settingsTableDialog", { visible: true, params: tableSetting, width: 630 });
};

watch(
  () => tableSetting,
  () => {
    localStorage.setItem("formularTable", JSON.stringify(tableSetting));
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
}

.control-btn-panel {
  display: flex;
  justify-content: space-between;
}

.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  @include pad;
}

.top-panel {
  border-bottom: 1px solid $neutral150;
}
</style>

<style>
.formTablePagination {
  margin-left: 20px;
  float: right;
}

.dopPanelF,
.dopPanelFContent {
  width: 100%;
  padding: 5px;
  border: 1px solid #dfe6ec;
  border-bottom: none;
}

.dopPanelFContent {
  overflow: auto;
}

.dopPanelF {
  text-align: center;
  cursor: pointer;
}

.formBottomPanel {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.buttonGroup {
  margin-right: 30px;
}
</style>
