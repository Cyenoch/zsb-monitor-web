<script setup lang="ts">import { useThemeVars } from 'naive-ui';

const props = defineProps(['value'])
const themeVars = useThemeVars()
const { value } = props;
</script>
<template>
  <div
    :style="{
      color: value > 0 ? themeVars.errorColor : value == 0 ? themeVars.railColor : themeVars.successColor
    }"
  >
    <i-carbon-caret-up text-base v-if="value > 0" vertical-middle />
    <i-carbon-caret-down text-base v-else-if="value < 0" vertical-middle />
    <div text-base v-else inline-block text-center w="28.8px" h="1px"></div>
    <span v-if="value > 0" vertical-middle>+</span>
    <span vertical-middle>
      <n-number-animation :duration="867" ref="numberAnimationInstRef" :from="0" :to="value" />
    </span>
  </div>
</template>
