<script setup lang="ts">import { useLocalStorage } from '@vueuse/core';
import { useAxios } from '@vueuse/integrations/useAxios';
import { computed, h, markRaw, nextTick, onMounted, ref, watch } from 'vue';
import client from '../client';
import UniversitySelector from './UniversitySelector.vue';
import MajorSelector from './MajorSelector.vue';
import ChangesTag from './ChangesTag.vue';
import moment from 'moment';
import { useThemeVars } from 'naive-ui';
import { TableColumns } from 'naive-ui/lib/data-table/src/interface';
import MajorTableSummaryVue from './MajorTableSummary.vue';

const { data: majors, error: error1 } = useAxios('/majors', {}, client)

const selectedUniversitiesName = ref<string[]>([]);
const selectedMajorsName = ref<string[]>([]);
const compareWithTime = ref(moment().subtract({ hours: 3 }).valueOf())
const queryParams = ref(new URLSearchParams({
  with: moment(compareWithTime.value).toDate().toString(),
}))
const themeVars = useThemeVars()

const { data, isLoading, isFinished, error, cancel, execute } = useAxios('/university/major/statistics/compare', {
  params: queryParams.value
}, client, { immediate: false })
const sortCount = ref<'ascend' | 'descend' | null>()
const sortRatio = ref<'ascend' | 'descend' | null>()
const compareArr = computed(() => data.value?.compare
  ?.map((v: any) => ({
    ...v,
    ratio: (v.number / v.count * 100).toFixed(2),
    ratioFmt: (v.number / v.count * 100).toFixed(2) + "%",

  }))
  .sort((a: any, b: any) => {
    switch (sortCount.value) {
      case 'ascend':
        return a.count - b.count
      case 'descend':
        return b.count - a.count
    }
    switch (sortRatio.value) {
      case 'ascend':
        return a.ratio - b.ratio
      case 'descend':
        return b.ratio - a.ratio
    }
    return null
  }))
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
    width: 75,
  }, {
    title: "报考人数",
    key: "count",
    sorter() { return 1; }
  }, {
    title: "招录比例",
    key: "ratioFmt",
    width: 100,
    sorter() { return 1; },
  }, {
    title: `相比 ${moment(compareWithTime.value).locale('zh_cn').fromNow()}`,
    key: "change",
    render(row, index) {
      return h(ChangesTag, {
        value: Number(row.count) - Number(findWith(row).count),
      })
    }
  }] as TableColumns);

const findWith = (value: any) => {
  return withArr.value?.find((v: any) => v.universityName === value.universityName && v.majorName === value.majorName)
}
const handleSelectChanged = (value: any) => {
  selectedUniversitiesName.value = value;
}
const handleSelectMajorChanged = (value: any) => {
  selectedMajorsName.value = value;
}
const handleUpdateSorter = (value: any) => {
  sortRatio.value = null;
  sortCount.value = null;
  switch (value.columnKey) {
    case "ratioFmt":
      sortRatio.value = value.order;
      break;
    case "count":
      sortCount.value = value.order;
      break;
  }
}
const summary = (pageData: any) => {
  return {
    count: {
      value: h('div', {}, []),
      colSpan: 3
    }
  }
}

const disablePreviousDate = (ts: number) => {
  return ts > moment().subtract({ millisecond: 1000 }).valueOf() || ts < moment().subtract({ day: 1 }).valueOf()
}

function load() {
  queryParams.value.set("with", moment(compareWithTime.value).toDate().toString());
  queryParams.value.delete("university")
  queryParams.value.delete("major")
  selectedUniversitiesName.value.forEach((element: any) => {
    queryParams.value.append("university", element);
  })
  selectedMajorsName.value.forEach((element: any) => {
    queryParams.value.append("major", element);
  })
  if (disablePreviousDate(compareWithTime.value)) return;
  // if (selectedUniversitiesName.value.length == 0) return;
  // if (selectedMajorsName.value.length == 0) return;
  if (isLoading.value && !isFinished.value) return;
  execute()
}

watch([selectedMajorsName, selectedUniversitiesName, compareWithTime], load, { deep: true })
onMounted(() => {
  load()
})

const host = import.meta.env.VITE_API_HOST
</script>
<template>
  <NGrid y-gap="18" cols="1">
    <NGridItem span="24">
      <UniversitySelector @select-changed="handleSelectChanged" />
    </NGridItem>
    <NGridItem span="24">
      <MajorSelector @select-changed="handleSelectMajorChanged" />
    </NGridItem>

    <NGridItem span="24" p-2 :style="{ backgroundColor: themeVars.cardColor }">
      <CompareSelector v-model="compareWithTime">
        <span mr-4></span>
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
          <n-button @click="() => execute()">散财消灾</n-button>
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
          @update:sorter="handleUpdateSorter"
        />

        <div mt-2 text-gray-400>
          <span text-gray-500>数据最后更新时间：</span>
          <n-time :to="timeTo" :time="time" type="relative" />
        </div>
      </template>
    </NGridItem>
  </NGrid>
</template>
