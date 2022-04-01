<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { LineChart, useLineChart } from 'vue-chart-3';
import { onMounted, ref } from 'vue';
import { useAxios } from '@vueuse/integrations/useAxios';
import client from '../client';
const router = useRouter()
const handleBack = () => {
  router.back();
};
const { data: collages, isFinished } = useAxios('/group-by', client)
const { lineChartProps, lineChartRef } = useLineChart({
  chartData: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'emm',
        backgroundColor: '#f87979',
        fill: '#66ccff',
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  },
});
</script>
<template>
  <NLayout style="overflow-y: auto;">
    <NLayoutHeader>
      <nav max-w-280 m-auto>
        <NPageHeader @back="handleBack" p-x-8 p-y-4>
          <template #title>
            <NIcon name="home" />
            <span>专升本报表统计</span>
          </template>

          <template #extra>
            <n-space>
              <n-dropdown
                :options="[{
                  label: '关于',
                  key: 'about'
                }]"
                placement="bottom-start"
              >
                <n-button :bordered="false" py-4>
                  <i-carbon-overflow-menu-horizontal text-xl />
                </n-button>
              </n-dropdown>
            </n-space>
          </template>
        </NPageHeader>
      </nav>
    </NLayoutHeader>
    <NLayoutContent>
      <main max-w-280 m-auto p-2>
        <router-view></router-view>
      </main>
    </NLayoutContent>
  </NLayout>
</template>
