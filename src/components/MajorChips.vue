<script setup lang="ts">
import { useIntervalFn, useLocalStorage, watchDebounced } from '@vueuse/core';
import useClient from '../uses/useClient';
import { computed, h, markRaw, nextTick, onMounted, ref, watch, watchEffect } from 'vue';
import client from '../client';
import UniversitySelector from './UniversitySelector.vue';
import MajorSelector from './MajorSelector.vue';
import ChangesTag from './ChangesTag.vue';
import moment from 'moment';
import { dataTableDark, useThemeVars } from 'naive-ui';
import { TableColumns } from 'naive-ui/lib/data-table/src/interface';
import MajorTableSummaryVue from './MajorTableSummary.vue';
import UniversitySelectorNew from './UniversitySelectorNew.vue';
import { useUniversityStore } from '../stores/university';
import { storeToRefs } from 'pinia';
import { sortBy } from 'lodash';
import _ from 'lodash';
import { disablePreviousDate } from '../consts';

const universityStore = useUniversityStore();
const themeVars = useThemeVars()
const { selectedUniversities, selectedUniverityNames } = storeToRefs(universityStore);

const autoReload = ref(false);
const selectedMajorsName = ref<string[]>([]);
const compareWithTime = ref(moment().subtract({ hours: 3 }).valueOf())
const queryParams = ref(new URLSearchParams({
  with: moment(compareWithTime.value).toDate().toString(),
}))
const { data, isLoading, error, execute } = useClient('/university/major/statistics/compare', { params: queryParams.value })

const compareArr = computed(() => data.value?.compare
  ?.map((v: any) => ({
    ...v,
    ratio: (v.number / v.count * 100).toFixed(2),
    ratioFmt: (v.number / v.count * 100).toFixed(2) + "%",

  })))
const withArr = computed(() => data.value?.with)

const timeTo = computed(() => moment.utc(compareArr.value?.[0].createdAt).valueOf());
const time = computed(() => moment().valueOf())

const columns = computed(() => [
  // {
  //   type: 'expand',
  //   expandable: (rowData) => rowData.name !== 'Jim Green',
  //   renderExpand: (rowData) => {
  //     return `${rowData.universityName} is a good university.`
  //   }
  // }, 
  {
    title: "学校",
    key: "universityName",
  }, {
    title: "专业",
    key: "majorName",
  }, {
    title: "招生人数",
    key: "number",
    sorter(r1: any, r2: any) { return r1.count - r2.count }
  }, {
    title: "报考人数",
    key: "count",
    sorter(r1: any, r2: any) { return r1.count - r2.count }
  }, {
    title: "招录比例",
    key: "ratioFmt",
    width: 100,
    sorter(r1: any, r2: any) { return r1.ratio - r2.ratio }
  }, {
    title: `相比 ${moment(compareWithTime.value).locale('zh_cn').fromNow()}`,
    key: "change",
    sorter(r1: any, r2: any) { return (Number(r1.count) - Number(findWith(r1).count)) - (Number(r2.count) - Number(findWith(r2).count)) },
    render(row, index) {
      return h(ChangesTag, {
        value: Number(row.count) - Number(findWith(row).count),
      })
    }
  }] as TableColumns);

const findWith = (value: any) => {
  return withArr.value?.find((v: any) => v.universityName === value.universityName && v.majorName === value.majorName)
}
const handleSelectMajorChanged = (value: any) => {
  selectedMajorsName.value = value;
}
const summary = (pageData: any) => {
  return {
    count: {
      value: h('div', {}, []),
      colSpan: 3
    }
  }
}

function load() {
  queryParams.value.set("with", moment(compareWithTime.value).toDate().toUTCString());
  queryParams.value.delete("university")
  queryParams.value.delete("major")
  selectedUniverityNames.value.forEach((name: any) => {
    queryParams.value.append("university", name);
  })
  selectedMajorsName.value.forEach((element: any) => {
    queryParams.value.append("major", element);
  })
  if (disablePreviousDate(compareWithTime.value)) return;
  execute()
}
watchDebounced([selectedMajorsName, selectedUniverityNames, compareWithTime], load, { deep: true, debounce: 500 })
useIntervalFn(() => {
  if (autoReload.value) load()
}, 1000 * 60 * 2)
const host = import.meta.env.VITE_API_HOST
</script>
<template>
  <NGrid y-gap="18" cols="1">
    <NGridItem span="24">
      <UniversitySelectorNew />
    </NGridItem>
    <NGridItem span="24">
      <MajorSelector @select-changed="handleSelectMajorChanged" />
    </NGridItem>

    <NGridItem span="24" p-2 :style="{ backgroundColor: themeVars.cardColor }">
      <CompareSelector v-model="compareWithTime">
        <div ml-4 flex-grow flex flex-row justify-end>
          <NCheckbox v-model:checked="autoReload">自动刷新(每2分钟)</NCheckbox>
          <NButton @click="load" size="small">刷新</NButton>
        </div>
      </CompareSelector>
    </NGridItem>

    <NGridItem>
      <n-result
        v-if="error"
        :status="'error'"
        :title="`${error.code ?? '000'} ${error.message}`"
        description="服务器出错可能说明该雇更多程序员了"
      >
        <template #footer>
          <n-button @click="() => load()">刷新</n-button>
        </template>
      </n-result>
      <template v-else>
        <NDataTable
          size="small"
          ref="dataTable"
          :columns="columns"
          :data="compareArr"
          :loading="isLoading"
          :row-key="(row) => `${row.universityName}-${row.majorName}`"
        />

        <div mt-2 text-gray-400>
          <span text-gray-500>数据最后更新时间：</span>
          <n-time :time="timeTo" :to="time" type="relative" />
        </div>
      </template>
    </NGridItem>
  </NGrid>
</template>
