<script setup lang="ts">
import { useAxios } from '@vueuse/integrations/useAxios';
import { computed, onMounted, ref, toRefs, watch, watchEffect } from 'vue';
import { useLineChart, LineChart } from 'vue-chart-3';
import { useRoute } from 'vue-router';
import moment from 'moment';
import client from '../client';
import { useThemeVars } from 'naive-ui';
import { useIntervalFn } from '@vueuse/core'

const themeVars = useThemeVars();

const props = defineProps<{ universityId: string, majorId: string }>()
const { universityId, majorId } = toRefs(props);

const rangeEnd = ref(moment());
const rangeStart = computed(() => moment(rangeEnd.value).subtract({ hours: 2 }));

const { data, isFinished, execute } = computed(() => useAxios(`/range`, {
  params: {
    universityId: universityId.value,
    majorId: majorId.value,
    start: rangeStart.value.toDate(),
    end: rangeEnd.value.toDate(),
  }
}, client)).value

const selectedData = computed(() => data.value?.filter((a: any, i: any) => i % 2 == 0) ?? []);
const labels = computed(() => selectedData.value?.map((r: any) => moment(r.createdAt).format("MM-DD HH:mm")) ?? []);
const count = computed(() => selectedData.value?.map((r: any) => r.count) ?? []);
const number = computed(() => selectedData.value?.map((r: any) => r.number) ?? []);
const datasets = computed(() => [
  {
    label: '报考数',
    backgroundColor: themeVars.value.successColor,
    borderColor: themeVars.value.successColor,
    data: count.value,
  },
  {
    label: '招生数',
    backgroundColor: themeVars.value.warningColor,
    borderColor: themeVars.value.warningColor,
    data: number.value,
  },
]);

const { lineChartProps, lineChartRef } = useLineChart({
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
      x: {
        title: {
          display: true,
          text: '时间轴'
        }
      },
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
});

watch([universityId], () => {
  execute();
});
watch([labels], () => {
  lineChartProps.value.chartData.labels = labels.value;
})
watch([datasets], () => {
  lineChartProps.value.chartData.datasets = datasets.value;
})

useIntervalFn(() => {
  rangeEnd.value = moment();
}, 6000 * 2);
</script>
<template>
  <LineChart v-if="data" v-bind="lineChartProps" />
</template>
