<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useAxios } from '@vueuse/integrations/useAxios';
import client from '../client';
import Sidebar from '../components/Sidebar.vue';
import { useMainStore } from '../stores/main';
const router = useRouter()
const showAbout = ref(false)
const mainStore = useMainStore()
const handleBack = () => {
  router.back();
};
const { data: collages, isFinished } = useAxios('/group-by', client)
function handleSelect(key: string) {
  switch (key) {
    case "about":
      showAbout.value = !showAbout.value;
      break
    case "toggleWatermark":
      mainStore.setShowWatermark(!mainStore.showWatermark);
      break
  }
}
</script>
<template>
  <NLayout bordered position="absolute" :native-scrollbar="false">
    <NLayoutHeader sticky inset-x-0 inset-t-0 z-100 bordered>
      <NPageHeader px-2 p-y-3 m-auto style="max-width: 1030px">
        <template #title>
          <NIcon name="home" />
          <span>专升本报表统计</span>
          <Sidebar m-l-4 />
        </template>

        <template #extra>
          <NRow align-items="center">
            <n-space>
              <n-dropdown
                :options="[{
                  label: '开关水印',
                  key: 'toggleWatermark'
                }, {
                  label: '关于',
                  key: 'about'
                }]"
                @select="handleSelect"
                placement="bottom-start"
              >
                <n-button :bordered="false" py-4>
                  <i-carbon-overflow-menu-horizontal text-xl />
                </n-button>
              </n-dropdown>
            </n-space>
          </NRow>
        </template>
      </NPageHeader>
    </NLayoutHeader>
    <NLayoutContent content-style="padding: 1rem" bordered>
      <main m-auto style="max-width: 1000px">
        <router-view></router-view>
      </main>
    </NLayoutContent>

    <n-modal v-model:show="showAbout" preset="dialog" title="关于">
      <template #header>
        <div>关于</div>
      </template>
      <div>
        <span>网站主要是给2022年专升本的同学报考院校提供帮助，非机构非盈利性质，切勿作其他用途！网站卡顿敬请谅解。</span>
        <a href="http://home.xxcheng.cn:29000/hbzsb/">友商</a>
        <h4>更新日志:</h4>
        <ul>
          <li>
            <span text-gray-400 mr-4>2022-04-03 16:24</span>
            <ol>
              <li>
                修复多个模块的若干问题，
                <s>提升系统稳定性</s>
              </li>
            </ol>
          </li>
          <li>
            <span text-gray-400 mr-4>2022-04-03 18:15</span>
            <ol>
              <li>
                修复多个模块的若干问题，
                <s>提升系统稳定性</s>
              </li>
              <li>
                <s>优化移动端表格显示效果</s>
              </li>
            </ol>
          </li>
        </ul>
        <footer>反馈bug或是有新的意见或建议 QQ: 1759761439</footer>
      </div>
      <template #action>
        <NButton secondary type="primary" @click="showAbout = false">👌</NButton>
        <NButton secondary type="info" @click="showAbout = false">👌</NButton>
        <NButton secondary type="error" @click="showAbout = false;">👌</NButton>
        <NButton secondary type="warning" @click="showAbout = false">👌</NButton>
      </template>
    </n-modal>
  </NLayout>
</template>
