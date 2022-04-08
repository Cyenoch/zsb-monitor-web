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
import { useUniversityStore } from '../stores/university';
import { storeToRefs } from 'pinia';
import { sortBy } from 'lodash';
import _ from 'lodash';
import { disablePreviousDate, isPublicSchool } from '../consts';
import MajorTableSummaryVue from './MajorTableSummary.vue';
import UniversitySelectorNew from './UniversitySelectorNew.vue';
import MajorChartVue from './MajorChart.vue';
import { useFavorite } from '../stores/favorite';

const favoriteStore = useFavorite();
const universityStore = useUniversityStore();
const themeVars = useThemeVars()
const { selectedUniversities, selectedUniverityNames } = storeToRefs(universityStore);

const autoReload = ref(false);
const selectedMajorsName = ref<string[]>([]);
const compareWithTime = ref(moment('2022-04-07 07:00:00.000').valueOf())
const queryParams = ref(new URLSearchParams({
  with: moment(compareWithTime.value).toDate().toString(),
}))
const { data, isLoading, error, execute } = useClient('/university/major/statistics/compare', { params: queryParams.value })

const compareArr = computed(() => data.value?.compare
  ?.map((v: any) => ({
    ...v,
    ratio: (v.number / v.count * 100).toFixed(2),
    ratioFmt: (v.number / v.count * 100).toFixed(2) + "%",
    with: findWith(v)
  })))
const withArr = computed(() => data.value?.with)
const allConditionEmpty = computed(() => selectedUniverityNames.value.length == 0 && selectedMajorsName.value.length == 0);
const timeTo = computed(() => moment.utc(compareArr.value?.[0].createdAt).valueOf());
const time = ref(moment().valueOf());
useIntervalFn(() => {
  time.value = moment().valueOf()
}, 1000)

const columns = computed(() => [
  {
    type: 'expand',
    expandable: (rowData) => rowData.name !== 'Jim Green',
    renderExpand: (rowData) => {
      return h(MajorChartVue as any, { universityName: rowData.universityName, majorName: rowData.majorName })
    }
  },
  {
    title: "学校",
    key: "universityName",
    render(row, index) {
      return h('span' as any, {
        style: isPublicSchool(row.universityName as any) ? 'font-weight: bold' : ''
      }, `${row.universityName}${isPublicSchool(row.universityName as any) ? '*' : ''}`);
    }
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
    sorter(r1: any, r2: any) { return (Number(r1?.count) - Number(r1.with?.count)) - (Number(r2?.count) - Number(r2.with?.count)) },
    render(row: any, index) {
      return h(ChangesTag, {
        value: Number(row.count) - Number(row.with?.count),
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

function selectFavorites() {
  universityStore.handleSelectUniversity(favoriteStore.favorite.map((v) => v.university));
  selectedMajorsName.value = favoriteStore.favorite.map((v) => v.major);
}

function load(force: boolean | undefined = false) {
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
  if (allConditionEmpty.value && !force) {
    data.value = null;
    return
  }
  execute()
}
watchDebounced([selectedMajorsName, selectedUniverityNames, compareWithTime], () => load(), { deep: true, debounce: 500 })
useIntervalFn(() => {
  if (autoReload.value) load(true)
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
        <div ml-4 flex-grow flex flex-row justify-end items-center>
          <NDivider vertical />
          <NCheckbox v-model:checked="autoReload">自动刷新(每2分钟)</NCheckbox>
          <NButton @click="() => load(true)" size="small">刷新</NButton>
          <NDivider vertical />
          <NButton
            v-if="favoriteStore.favorite.length > 0"
            @click="selectFavorites"
            size="small"
          >选择我的收藏</NButton>
        </div>
      </CompareSelector>
    </NGridItem>

    <NGridItem>
      <div v-if="!error && !isLoading && allConditionEmpty && compareArr == null" text-center>
        <NButton type="success" @click="() => load(true)">点此处加载全部学校、全部专业的数据</NButton>
        <NDivider />
      </div>
      <n-result
        v-else-if="error"
        :status="'error'"
        :title="`${error.code ?? '000'} ${error.message}`"
        description="服务器出错可能说明该雇更多程序员了"
      >
        <template #footer>
          <n-button @click="() => load()">刷新</n-button>
        </template>
      </n-result>
      <template v-else>
        <span block text-xs text-gray-500 pb-4>* 学校名称字体加粗带星号(*)表示为公办院校</span>
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
          <span>升本报名已结束，数据已不再更新。</span>
        </div>
      </template>
    </NGridItem>
  </NGrid>
</template>
