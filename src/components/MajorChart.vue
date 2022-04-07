<script setup lang="ts">
import { useAxios } from '@vueuse/integrations/useAxios';
import { computed, onMounted, ref, toRef, toRefs, watch, watchEffect } from 'vue';
import { useLineChart, LineChart } from 'vue-chart-3';
import { useRoute } from 'vue-router';
import moment from 'moment';
import client from '../client';
import { useThemeVars } from 'naive-ui';
import { useIntervalFn, useLocalStorage } from '@vueuse/core'
import { disabledDateRange } from '../consts';
import loading from 'naive-ui/lib/_internal/loading';
import { useFavorite } from '../stores/favorite';

const themeVars = useThemeVars();

const props = defineProps<{ universityName: string, majorName: string }>()
const { universityName, majorName } = toRefs(props);
const range = ref([moment('2022-04-07 07:00:00.000').valueOf(), moment().valueOf()]);
const rangeEnd = computed(() => range.value[1]);
const rangeStart = computed(() => range.value[0]);
const requestOptions = ref({
  params: {
    universityName: universityName.value,
    majorName: majorName.value,
    start: new Date(rangeStart.value),
    end: new Date(rangeEnd.value),
  }
});

const { data, isFinished, execute } = useAxios(`/range`, requestOptions.value, client, { immediate: false })

const selectedData = computed(() => data.value ?? []);
const labels = computed(() => selectedData.value?.map((r: any) => moment(r.createdAt).format("MM-DD  HH:mm")) ?? []);
const count = computed(() => selectedData.value?.map((r: any) => r.count) ?? []);
const number = computed(() => selectedData.value?.map((r: any) => r.number) ?? []);
const datasets = computed(() => [
  {
    label: '报考数',
    backgroundColor: themeVars.value.successColor,
    borderColor: themeVars.value.successColor,
    data: count.value,
    borderWidth: 2,
    pointRadius: 1,
  },
  {
    label: '招生数',
    backgroundColor: themeVars.value.warningColor,
    borderColor: themeVars.value.warningColor,
    data: number.value,
    borderWidth: 1,
    pointRadius: 1,
  },
]);

const chartData = computed<any>(() => ({
  chartData: {
    labels: labels.value,
    datasets: datasets.value,
  },
  options: {
    responsive: true,
    legend: {
      display: true,
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false
      },
    },
    hover: {
      mode: 'index',
      intersec: false
    },
    scales: {
      y: {
        title: {
          display: true,
          text: '报考人数'
        },
        min: 0,
        ticks: {
          stepSize: 10
        },
      },
    },
  },
}))
const { lineChartProps, lineChartRef } = useLineChart({ chartData });
function load() {
  requestOptions.value.params.start = moment(rangeStart.value).utc().toDate();
  requestOptions.value.params.end = moment(rangeEnd.value).utc().toDate();
  if (universityName.value == null || majorName.value == null) return;
  execute();
}
watch([universityName, majorName, range], () => {
  load();
}, { deep: true });
watch([labels], () => {
  lineChartProps.value.chartData.labels = labels.value;
}, { deep: true })
watch([datasets], () => {
  lineChartProps.value.chartData.datasets = datasets.value;
}, { deep: true })
onMounted(() => {
  load();
})
const favoriteStore = useFavorite()
const isFavorite = computed(() => favoriteStore.isFavorite(universityName.value, majorName.value))
function handleFavoriteChange(value: boolean) {
  (value ? favoriteStore.addFavorite : favoriteStore.removeFavorite)(universityName.value, majorName.value)
}
</script>
<template>
  <div>
    <div flex flex-row items-center flex-wrap>
      <n-date-picker
        flex-grow
        v-model:value="(range as any)"
        type="datetimerange"
        clearable
        :is-date-disabled="disabledDateRange"
      />
      <NDivider vertical />
      <div flex-shrink-0>
        <span>添加专业到收藏：</span>
        <NSwitch
          :default-value="isFavorite"
          v-model="isFavorite"
          @update:value="handleFavoriteChange"
        />
      </div>
    </div>
    <LineChart v-if="data" v-bind="lineChartProps" />
  </div>
</template>
