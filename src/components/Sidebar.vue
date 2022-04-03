<script setup lang="ts">import { h, ref, toRefs } from 'vue';
import { RouterLink, RouterLinkProps } from 'vue-router';
import { MenuOption } from 'naive-ui';

const menuOptions = ref<MenuOption[]>([{
  label: () =>
    h(
      RouterLink,
      {
        to: { name: 'index', }
      },
      { default: () => '首页' }
    ),
  key: 'index',
}, {
  label: () => h(
    'span',
    {},
    { default: () => '学校' }
  ),
  children: [{
    label: () => h(
      RouterLink,
      {
        to: { name: 'universities', }
      } as RouterLinkProps,
      { default: () => '所有学校' }
    )
  }, {
    label: () => h(
      RouterLink,
      {
        to: { name: 'universities', query: { type: 'public' } }
      } as RouterLinkProps,
      { default: () => '公办学校' }
    )
  }, {
    label: () => h(
      RouterLink,
      {
        to: { name: 'universities', query: { type: 'private' } }
      } as RouterLinkProps,
      { default: () => '民办学校' }
    )
  }],
  key: 'universities',
},
// {
//   disabled: true,
//   label: () => h(
//     'a',
//     {
//       to: { name: 'majors', }
//     },
//     { default: () => '图表' }
//   ),
//   key: 'charts'
// },
// {
//   disabled: true,
//   label: () => h(
//     'a',
//     {
//       to: { name: 'majors', }
//     },
//     { default: () => '汇总' }
//   ),
//   key: 'charts'
// }
])
</script>
<template>
  <n-menu
    :collapsed="false"
    :collapsed-width="64"
    :collapsed-icon-size="22"
    :options="(menuOptions as any)"
    mode="horizontal"
  />
</template>
