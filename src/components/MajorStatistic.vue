<script lang="ts" setup>
import { useAxios } from '@vueuse/integrations/useAxios';
import { useThemeVars } from 'naive-ui';
import { computed, reactive, ref, toRef, toRefs, watch, watchEffect } from 'vue';
import { useRoute, useRouter, parseQuery } from 'vue-router';
import client from '../client';
import moment from 'moment';

const props = defineProps<{ universityInfo: any, withInfo: any }>()
const { universityInfo, withInfo } = toRefs(props);

const themeVars = useThemeVars()

const countIncremented = computed(() => Number(universityInfo.value.count) - Number(withInfo.value.count))
</script>
<template>
  <NLayout embedded :style="{ backgroundColor: themeVars.cardColor }">
    <n-row p-4>
      <n-col :span="24">
        <n-statistic :label="universityInfo.universityName">
          <n-number-animation
            :duration="1555"
            ref="numberAnimationInstRef"
            :from="0"
            :to="Number(universityInfo.count)"
          />
          <template #prefix>
            <n-icon>
              <i-carbon-user />
            </n-icon>
          </template>
          <template #suffix>
            <div inline-block ml-1>/ {{ universityInfo.number }}</div>
            <NDivider vertical class="!ml-4" />
            <div
              inline-block
              :style="{
                color: countIncremented > 0 ? themeVars.errorColor : countIncremented == 0 ? themeVars.railColor : themeVars.successColor
              }"
            >
              <i-carbon-caret-up text-base v-if="countIncremented > 0" vertical-middle />
              <i-carbon-caret-down text-base v-else-if="countIncremented < 0" vertical-middle />
              <div text-base v-else inline-block text-center w="28.8px" h="28.8px"></div>
              <span v-if="countIncremented > 0" vertical-middle>+</span>
              <span vertical-middle>{{ countIncremented }}</span>
            </div>
          </template>
        </n-statistic>
      </n-col>
    </n-row>
  </NLayout>
</template>
