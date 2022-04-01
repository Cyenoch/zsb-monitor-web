<script setup lang="ts">
import { defineComponent, computed } from 'vue'
import { useOsTheme, darkTheme } from 'naive-ui'

const osThemeRef = useOsTheme()
const theme = computed(() => (osThemeRef.value === 'dark' ? darkTheme : null));
const osTheme = osThemeRef
</script>

<template>
  <NConfigProvider :theme="theme" config="config">
    <router-view style="min-height: 100vh;"></router-view>
  </NConfigProvider>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
