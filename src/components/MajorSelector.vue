<script lang="ts" setup>
import { useAxios } from '@vueuse/integrations/useAxios';
import { useThemeVars } from 'naive-ui';
import { computed, onMounted, reactive, ref, toRef, toRefs, watch, watchEffect } from 'vue';
import { useRoute, useRouter, parseQuery } from 'vue-router';
import client from '../client';
import { isPublicSchool } from '../consts';
import { useLocalStorage } from '@vueuse/core';
import moment from 'moment';

const emit = defineEmits(['selectChanged'])
const router = useRouter()
const route = useRoute()
const selectedMajorsName = useLocalStorage<string[]>('selectedMajors', []);
const selectedMajors = computed<any[]>(() => majors.value?.filter((c: any) => selectedMajorsName.value.includes(c.majorName)));
const themeVars = useThemeVars()

const { data, isFinished, execute } = useAxios('/majors', client)

const majors = computed(() => data.value)

const handleSelectUniversity = (name: string) => {
  const index = selectedMajorsName.value.findIndex((item: any) => item === name);
  if (index >= 0) {
    selectedMajorsName.value.splice(index, 1)
  } else {
    selectedMajorsName.value.push(name)
  }
  emit('selectChanged', selectedMajorsName.value)
}

onMounted(() => {
  emit('selectChanged', selectedMajorsName.value)
})
</script>
<template>
  <NGrid x-gap="16" y-gap="16" cols="1 560:2 800:3 1100:4 1400:5">
    <NGridItem span="24" p-2 :style="{ backgroundColor: themeVars.cardColor }">
      <n-collapse arrow-placement="right">
        <n-collapse-item title="选择专业" name="1">
          <template v-if="isFinished">
            <NSpace>
              <NTag
                style="cursor: pointer; user-select: none; padding: 16px 14px"
                :type="selectedMajorsName.find((c: any) => c == major.majorName) ? 'success' : 'default'"
                :style="selectedMajorsName.find((c: any) => c == major.majorName)
                ? {
                  backgroundColor: themeVars.primaryColor,
                  color: themeVars.baseColor
                } : {}"
                @click="handleSelectUniversity(major.majorName)"
                v-for="major in majors"
              >{{ major.majorName }}</NTag>
            </NSpace>
          </template>
          <template v-else>
            <NSpace vertical>
              <n-skeleton :repeat="6" :sharp="false" size="medium" />
            </NSpace>
          </template>
          <template #header-extra>
            <span text-gray-500>点击展开 选择专业</span>
          </template>
        </n-collapse-item>
      </n-collapse>
      <NDivider class="!my-2" />
      <div flex flex-row>
        <span
          flex-grow
          text-gray-500
          style="vertical-align: middle;overflow-x: hidden; text-overflow: ellipsis; white-space: nowrap;"
        >{{ selectedMajorsName.join("、") }}</span>
        <NButton
          v-if="selectedMajorsName.length > 0"
          type="tertiary"
          m-l-2
          size="small"
          float-right
          @click="() => { selectedMajorsName = []; emit('selectChanged', selectedMajorsName) }"
        >取消选择</NButton>
      </div>
    </NGridItem>
  </NGrid>
</template>
