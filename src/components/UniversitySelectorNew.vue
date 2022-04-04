<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core';
import { useAxios } from '@vueuse/integrations/useAxios';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import client from '../client';
import { isPublicSchool } from '../consts';
import { useUniversityStore } from '../stores/university';

const emit = defineEmits(['selectChanged'])
const onlyPublicSchool = ref(false)
const universityStore = useUniversityStore();
const { selectedUniverityNames: selected, universityOptions: options } = storeToRefs(universityStore)

const filteredOptions = computed(() => {
  return options.value.filter((v: any) => onlyPublicSchool.value ? isPublicSchool(v.value) : true)
})

onMounted(() => {
  emit('selectChanged', selected.value)
})

watch([selected], () => {
  emit('selectChanged', selected.value)
}, { deep: true })

function handleSelectAll(value: boolean) {
  if (value) {
    selected.value = filteredOptions.value.map((v: any) => v.value)
  } else {
    selected.value = [];
  }
}
</script>
<template>
  <div flex flex-row items-center>
    <label flex-shrink-0 text-md font-bold mr-2>选择院校:</label>
    <n-select
      flex-grow
      :value="selected"
      :options="filteredOptions"
      :filterable="true"
      :clearable="true"
      multiple
      placeholder="搜索或选择院校"
      :loading="universityStore.universitiesLoading"
      @update:value="universityStore.handleSelectUniversity"
      @search="universityStore.handleSearch"
    >
      <template #action>
        <n-checkbox v-model:checked="onlyPublicSchool">仅显示公办院校</n-checkbox>
        <n-checkbox @update:checked="handleSelectAll">全选</n-checkbox>
      </template>
    </n-select>
  </div>
</template>
