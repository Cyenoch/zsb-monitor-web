<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import { computed, onMounted, reactive, ref, toRef, toRefs, watch, watchEffect } from 'vue';
import moment from 'moment';

const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue'])

const compareWithTime = ref(props.modelValue ?? moment().subtract({ hours: 3 }).valueOf())

const disablePreviousDate = (ts: number) => {
  return ts > moment().subtract({ millisecond: 1000 }).valueOf() || ts < moment().subtract({ day: 1 }).valueOf()
}

watchEffect(() => {
  emits('update:modelValue', compareWithTime.value)
})
</script>
<template>
  <div flex flex-row items-center flex-wrap>
    <span>对比时间</span>
    <span mx-4>
      <n-date-picker
        size="small"
        v-model:value="compareWithTime"
        type="datetime"
        clearable
        :is-date-disabled="disablePreviousDate"
      />
    </span>
    <n-time :time="moment().valueOf()" :to="compareWithTime" type="relative" />
    <slot></slot>
  </div>
</template>
