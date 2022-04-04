<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import { computed, onMounted, reactive, ref, toRef, toRefs, watch, watchEffect } from 'vue';
import moment from 'moment';
import { disablePreviousDate } from '../consts';

const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue'])

const compareWithTime = ref(props.modelValue ?? moment().subtract({ hours: 3 }).valueOf())

watchEffect(() => {
  emits('update:modelValue', compareWithTime.value)
})
</script>
<template>
  <div flex flex-row items-center flex-wrap>
    <span mr-4>目标对比时间</span>
    <span mr-4>
      <n-date-picker
        w-47
        size="small"
        v-model:value="compareWithTime"
        type="datetime"
        clearable
        :is-date-disabled="disablePreviousDate"
      />
    </span>
    <span>
      将比对<n-time :to="moment().valueOf()" :time="compareWithTime" type="relative" />的数据
    </span>
    <slot flex-grow></slot>
  </div>
</template>
