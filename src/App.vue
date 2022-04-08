<script setup lang="ts">
import { defineComponent, computed } from 'vue'
import { useOsTheme, darkTheme } from 'naive-ui'
import { zhCN, dateZhCN } from 'naive-ui'
import { useMainStore } from './stores/main';

const osThemeRef = useOsTheme()
const theme = computed(() => (osThemeRef.value === 'dark' ? darkTheme : null));
const osTheme = osThemeRef

const mainStore = useMainStore();
</script>

<template>
  <NConfigProvider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="theme"
    config="config"
    :theme-overrides="{ common: { fontWeightStrong: '600' } }"
  >
    <n-watermark
      v-if="mainStore.showWatermark"
      content="02dsk.club"
      cross
      fullscreen
      selectable
      :font-size="22"
      :line-height="16"
      font-color="rgba(128, 128, 128, .12)"
      :width="292"
      :height="298"
      :x-offset="12"
      :y-offset="88"
      :rotate="-36"
    ></n-watermark>
    <router-view style="min-height: 100vh;"></router-view>
  </NConfigProvider>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
a:visited {
  color: rgb(122, 122, 122);
}
</style>
