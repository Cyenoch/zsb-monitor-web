import { useLocalStorage } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios";
import { defineStore } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import client from "../client";

export const useUniversityStore = defineStore('university', () => {
  const { data: universities, isLoading: universitiesLoading, execute: reloadUniversities } = useAxios('/universities', client, { immediate: false })
  const selectedUniverityNames = useLocalStorage<string[]>('selectedUniverityNames', []);
  const universitiesCached = useLocalStorage<any[]>('universitiesCached', []);
  const query = ref<string>()

  const universityOptions = computed(() => universitiesCached.value?.filter((value) => {
    if (query.value) {
      return value.universityName.match(new RegExp(`${query.value}`, 'g'))
    } else return true
  }).map(({ universityName }: any) => ({ value: universityName, label: universityName })))

  onMounted(() => {
    if (!universitiesCached.value || universitiesCached.value.length == 0) reloadUniversities();
  })

  watch([universities], () => {
    universitiesCached.value = universities.value;
  }, { deep: true })

  return {
    universityOptions,
    universitiesLoading,
    selectedUniverityNames,
    selectedUniversities: universitiesCached,
    reloadUniversities,
    handleSelectUniversity: (names: string[]) => {
      selectedUniverityNames.value = names;
    },
    handleSearch: (_query: string) => {
      query.value = _query.trim() == '' ? undefined : _query;
    }
  }
});
