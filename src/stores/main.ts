
import { useLocalStorage } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios";
import { defineStore } from "pinia";
import { computed, onMounted, watch, watchEffect } from "vue";
import client from "../client";

export const useMainStore = defineStore('main', () => {
  const settings = useLocalStorage('settings', { watermark: true, showInitialInfo: true, appVersion: '0.0.0' });
  const showWatermark = computed(() => settings.value.watermark);
  const setShowWatermark = (value: boolean) => settings.value.watermark = value;

  onMounted(() => {
    console.table({ "APP VERSION": import.meta.env.VITE_APP_VERSION });

    if (settings.value.appVersion !== import.meta.env.VITE_APP_VERSION) {
      settings.value.appVersion = import.meta.env.VITE_APP_VERSION!;
      settings.value.showInitialInfo = true;
    }
  })

  return { settings, showWatermark, setShowWatermark }
})
