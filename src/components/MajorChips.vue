<script setup lang="ts">import { useLocalStorage } from '@vueuse/core';
import { useAxios } from '@vueuse/integrations/useAxios';
import { computed, onMounted, ref, watchEffect } from 'vue';
import client from '../client';
import UniversitySelector from './UniversitySelector.vue';
import MajorSelector from './MajorSelector.vue';
import moment from 'moment';
import { useThemeVars } from 'naive-ui';

const { data: majors, error: error1 } = useAxios('/majors', {}, client)

const selectedUniversitiesName = ref<string[]>([]);
const selectedMajorsName = ref<string[]>([]);
const compareWithTime = ref(moment().subtract({ hours: 3 }).valueOf())
const queryParams = ref(new URLSearchParams({
  // with: moment(compareWithTime.value).toDate().toString(),
}))
const themeVars = useThemeVars()

const { data, isLoading, cancel, execute } = useAxios('/university/major/statistics', {
  params: queryParams.value
}, client, { immediate: false })

const sortCount = ref<'ascend' | 'descend' | null>()
const sortRatio = ref<'ascend' | 'descend' | null>()
const compareArr = computed(() => data.value
  ?.map((v: any) => ({
    ...v,
    ratio: (v.number / v.count * 100).toFixed(2),
    ratioFmt: (v.number / v.count * 100).toFixed(2) + "%"
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

const columns = [{
  title: "学校",
  key: "universityName"
}, {
  title: "专业",
  key: "majorName"
}, {
  title: "招生人数",
  key: "number",
}, {
  title: "报考人数",
  key: "count",
  sorter() { return 1; }
}, {
  title: "招录比例",
  key: "ratioFmt",
  sorter() { return 1; }
}]

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

const disablePreviousDate = (ts: number) => {
  return ts > moment().subtract({ millisecond: 1000 }).valueOf() || ts < moment().subtract({ day: 1 }).valueOf()
}

function load() {
  // queryParams.value.set("with", moment(compareWithTime.value).toDate().toString());
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
  execute()
}

watchEffect(load)
onMounted(() => {
  if (isLoading) return;
  // load()
})
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
      <CompareSelector v-if="false" v-model="compareWithTime">
        <span mr-4></span>
        <div>
          <span text-gray-500>数据最后更新时间：</span>
          <n-time :time="timeTo" :to="time" type="relative" />
        </div>
      </CompareSelector>

      <div>
        <span text-gray-500>数据最后更新时间：</span>
        <n-time :time="timeTo" :to="time" type="relative" />
      </div>
    </NGridItem>

    <NGridItem>
      <NDataTable
        remote
        ref="dataTable"
        :columns="columns"
        :data="compareArr"
        :loading="isLoading"
        :row-key="(row) => `${row.universityName}-${row.majorName}`"
        @update:sorter="handleUpdateSorter"
      />
    </NGridItem>
  </NGrid>
</template>
