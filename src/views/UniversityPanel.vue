<script setup lang="ts">
import { useAxios } from '@vueuse/integrations/useAxios';
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { useLineChart, LineChart } from 'vue-chart-3';
import { useRoute } from 'vue-router';
import moment from 'moment';
import client from '../client';
import MajorChart from '../components/MajorChart.vue';

const route = useRoute()

const currentSelectedUniversity = computed(() => route.query.id);
const requestParams = ref(({
  params: {
    universityId: currentSelectedUniversity.value,
  }
}));

const {
  data: majors,
  isLoading: majorsIsLoading,
  error: majorsError,
  execute: loadMajors
} = computed(() => useAxios(`/majors`, requestParams.value, client)).value;

watch([currentSelectedUniversity], () => {
  requestParams.value.params.universityId = currentSelectedUniversity.value;
  loadMajors();
});
</script>
<template>
  <NDivider />
  <NGrid cols="1">
    <NGridItem>
      <n-skeleton m-b-2 v-if="majorsIsLoading" :repeat="10" :sharp="false" size="medium" />
    </NGridItem>

    <NGridItem v-for="major in majors">
      <h2>{{ major.majorName }}</h2>
      <MajorChart :university-id="major.universityId" :major-id="major.majorId" />
    </NGridItem>
  </NGrid>
</template>
