<script lang="ts" setup>
import { useAxios } from '@vueuse/integrations/useAxios';
import { useThemeVars } from 'naive-ui';
import { computed, onMounted, reactive, ref, toRef, toRefs, watch, watchEffect } from 'vue';
import client from '../client';
import moment from 'moment';
import UniversityStatistic from './UniversityStatistic.vue';
import UniversitySelector from './UniversitySelector.vue';
import CompareSelector from './CompareSelector.vue';

const selectedUniversitiesName = ref<string[]>([]);
const selectedUniversities = computed<any[]>(() => collages.value?.filter((c: any) => selectedUniversitiesName.value.includes(c.universityName)));
const compareWithTime = ref(moment().subtract({ hours: 3 }).valueOf())
const queryParams = ref(new URLSearchParams({
  with: moment(compareWithTime.value).toDate().toString(),
}))
const themeVars = useThemeVars()

const { data, isLoading, cancel, execute } = useAxios('/university/statistics/compare', {
  params: queryParams.value
}, client, { immediate: false })

const collages = computed(() => data.value?.compare)
const withCollages = computed(() => data.value?.with)

const timeTo = computed(() => moment.utc(collages.value?.[0].createdAt).valueOf());
const time = computed(() => moment().valueOf())

const disablePreviousDate = (ts: number) => {
  return ts > moment().subtract({ millisecond: 1000 }).valueOf() || ts < moment().subtract({ day: 1 }).valueOf()
}

const handleSelectChanged = (value: any) => {
  selectedUniversitiesName.value = value;
}

watchEffect(() => {
  queryParams.value.set("with", moment(compareWithTime.value).toDate().toString());
  queryParams.value.delete("university")
  selectedUniversitiesName.value.forEach((element: any) => {
    queryParams.value.append("university", element);
  })
  if (disablePreviousDate(compareWithTime.value)) return;
  if (selectedUniversitiesName.value.length == 0) return;
  // if (isLoading.value) cancel();
  execute()
})
onMounted(() => {
  if (disablePreviousDate(compareWithTime.value)) return;
  if (selectedUniversitiesName.value.length == 0) return;
  if (isLoading.value) return;
  execute()
})
</script>
<template>
  <n-spin :show="isLoading">
    <template #description>给服务器阿姨倒杯卡布奇诺~</template>
    <NGrid x-gap="16" y-gap="16" cols="1 560:2 800:3 1100:4 1400:5">
      <NGridItem span="24">
        <UniversitySelector @select-changed="handleSelectChanged" />
      </NGridItem>

      <NGridItem span="24" p-2 :style="{ backgroundColor: themeVars.cardColor }">
        <CompareSelector v-model="compareWithTime">
          <span mr-4></span>
          <div>
            <span text-gray-500>数据最后更新时间：</span>
            <n-time :to="timeTo" :time="time" type="relative" />
          </div>
        </CompareSelector>
      </NGridItem>

      <template v-if="selectedUniversitiesName && withCollages">
        <NGridItem v-for="university in selectedUniversities">
          <UniversityStatistic
            :university-info="university"
            :with-info="withCollages.find((c: any) => c.universityName == university.universityName)"
          />
        </NGridItem>
      </template>
    </NGrid>
  </n-spin>
</template>
