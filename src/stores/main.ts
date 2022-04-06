
import { useLocalStorage } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios";
import { defineStore } from "pinia";
import { computed, onMounted, watch, watchEffect } from "vue";
import client from "../client";

export const useMainStore = defineStore('main', () => {
  const settings = useLocalStorage('settings', { watermark: true, showInitialInfo: true })
  const showWatermark = computed(() => settings.value.watermark);
  const setShowWatermark = (value: boolean) => settings.value.watermark = value;

  return { settings, showWatermark, setShowWatermark }
})
