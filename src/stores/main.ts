
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed } from "vue";

export const useMainStore = defineStore('main', () => {
  const settings = useLocalStorage('settings', { watermark: true })
  const showWatermark = computed(() => settings.value.watermark);
  const setShowWatermark = (value: boolean) => settings.value.watermark = value;
  return { settings, showWatermark, setShowWatermark }
})
