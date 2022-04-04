<script setup lang="ts">import { toRefs } from 'vue';

const props = defineProps(['data'])

const { data } = toRefs(props);
</script>
<template>
  <NCard></NCard>
</template>
