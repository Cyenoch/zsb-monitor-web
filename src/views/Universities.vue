<script setup lang="ts">
import UniversityChips from '../components/UniversityChips.vue';
</script>
<template>
  <div>
    <span block text-xs text-gray-500 pb-4>* 选择院校后显示对应院校的报考总数和招生总数信息，并于对比时间进行比对（默认与3小时前进行比对）。</span>
    <UniversityChips />
  </div>
</template>
