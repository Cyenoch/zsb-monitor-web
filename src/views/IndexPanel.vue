<script lang="ts" setup>
import { useAxios } from '@vueuse/integrations/useAxios';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import client from '../client';
const router = useRouter()
const route = useRoute()
const { data: collages, isFinished } = useAxios('/group-by', client)
const handleSelectUniversity = (id: string) => {
  router.push({ name: 'university-panel', query: { id } })
}
const currentSelectedUniversity = computed(() => route.query.id);
</script>
<template>
  <NGrid cols="1 900:2">
    <NGridItem span="2">
      <template v-if="isFinished">
        <NSpace>
          <NTag
            style="cursor: pointer;user-select: none;"
            :style="{
              color: currentSelectedUniversity == collage.universityId ? '#66ccff' : ''
            }"
            @click="() => handleSelectUniversity(collage.universityId)"
            v-for="collage in collages"
          >{{ collage.universityName }}</NTag>
        </NSpace>
      </template>
      <template v-else>
        <NSpace vertical>
          <n-skeleton v-for="_ in 6" :sharp="false" size="medium" />
        </NSpace>
      </template>
    </NGridItem>
  </NGrid>
  <router-view></router-view>
</template>
