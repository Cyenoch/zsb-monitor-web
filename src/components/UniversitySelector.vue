<script lang="ts" setup>
import { useAxios } from '@vueuse/integrations/useAxios';
import { useThemeVars } from 'naive-ui';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import client from '../client';
import { isPublicSchool } from '../consts';
import { useLocalStorage } from '@vueuse/core';
import moment from 'moment';

const emit = defineEmits(['selectChanged'])
const route = useRoute()
const selectedUniversitiesName = useLocalStorage<string[]>('selectedUniverities', []);
const selectedUniversities = computed<any[]>(() => collages.value?.filter((c: any) => selectedUniversitiesName.value.includes(c.universityName)));
const themeVars = useThemeVars()

const universityType = computed(() => route.query.type);

const { data, isFinished, execute } = useAxios('/universities', client)

const collages = computed(() => data.value)

const filteredCollages = computed(() => {
  const type = universityType.value
  switch (type) {
    case "public":
      return collages.value.filter((collage: any) => isPublicSchool(collage.universityName))
    case "private":
      return collages.value.filter((collage: any) => !isPublicSchool(collage.universityName))
  }
  return collages.value;
})

const handleSelectUniversity = (name: string) => {
  const index = selectedUniversitiesName.value.findIndex((item: any) => item === name);
  if (index >= 0) {
    selectedUniversitiesName.value.splice(index, 1)
  } else {
    selectedUniversitiesName.value.push(name)
  }
  emit('selectChanged', selectedUniversitiesName.value)
}

onMounted(() => {
  emit('selectChanged', selectedUniversitiesName.value)
})
</script>
<template>
  <NGrid x-gap="16" y-gap="16" cols="1 560:2 800:3 1100:4 1400:5">
    <NGridItem span="24" p-2 :style="{ backgroundColor: themeVars.cardColor }">
      <n-collapse arrow-placement="right">
        <n-collapse-item
          :title="universityType == 'public' ? '公办院校' : universityType == 'private' ? '民办院校' : '专升本招生院校'"
          name="1"
        >
          <template v-if="isFinished">
            <NSpace>
              <NTag
                style="cursor: pointer; user-select: none; padding: 16px 14px"
                :type="selectedUniversitiesName.find((c: any) => c == collage.universityName) ? 'success' : isPublicSchool(collage.universityName) ? 'info' : 'default'"
                :style="selectedUniversitiesName.find((c: any) => c == collage.universityName)
                ? {
                  backgroundColor: themeVars.primaryColor,
                  color: themeVars.baseColor
                } : {}"
                @click="handleSelectUniversity(collage.universityName)"
                v-for="collage in filteredCollages"
              >{{ collage.universityName }}</NTag>
            </NSpace>
            <span block text-xs text-gray-500 pt-2>* 蓝色边框字体为公办院校</span>
          </template>
          <template v-else>
            <NSpace vertical>
              <n-skeleton :repeat="6" :sharp="false" size="medium" />
            </NSpace>
          </template>
          <template #header-extra>
            <span text-gray-500>点击展开 选择院校</span>
          </template>
        </n-collapse-item>
      </n-collapse>
      <NDivider class="!my-2" />
     <div flex flex-row>
        <span
          text-gray-500
          flex-grow
          style="vertical-align: middle;overflow-x: hidden; text-overflow: ellipsis; white-space: nowrap;"
        >{{ selectedUniversitiesName.join("、") }}</span>
        <NButton
          v-if="selectedUniversitiesName.length > 0"
          type="tertiary"
          m-l-2
          size="small"
          float-right
          @click="() => { selectedUniversitiesName = []; emit('selectChanged', selectedUniversitiesName) }"
        >取消选择</NButton>
      </div>
    </NGridItem>
  </NGrid>
</template>
