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
    case "hello":
      window.open("https://jq.qq.com/?_wv=1027&k=fyodZi6c");
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
                  label: '关于&反馈&捐赠',
                  key: 'about'
                }, {
                  label: '你好，点我进群',
                  key: 'hello',
                }]"
                @select="handleSelect"
                placement="bottom-start"
              >
                <n-button :bordered="false" py-4>
                  👋
                  <i-carbon-overflow-menu-horizontal text-xl />
                </n-button>
              </n-dropdown>
            </n-space>
          </NRow>
        </template>
      </NPageHeader>
    </NLayoutHeader>
    <NLayoutContent content-style="padding: 1rem;min-height: 90vh" bordered>
      <main m-auto style="max-width: 1000px">
        <!-- <n-alert v-if="false" title="服务器被干烂了" closable type="warning">
          服务器被打烂了，不知道是哪个没事做的干的，我又不赚钱，打我服务器干嘛。建了个群，有消息会在里面通知，有兴趣可以加下：
          <a
            href="https://jq.qq.com/?_wv=1027&k=fyodZi6c"
          >130456682</a>
        </n-alert>-->
        <n-alert
          v-if="mainStore.settings.showInitialInfo || mainStore.settings.showInitialInfo == undefined"
          @close="mainStore.settings.showInitialInfo = false"
          closable
          title="为美好的世界献上祝福"
          type="success"
        >
          真心祝大家顺利上岸~包括我在内... 欢迎进群唠嗑:
          <div>
            一群：
            <a href="https://jq.qq.com/?_wv=1027&k=VjUVBfWJ">811090826</a>
          </div>
          <div>
            二群：
            <a href="https://jq.qq.com/?_wv=1027&k=fyodZi6c">130456682</a>
          </div>
        </n-alert>
        <NDivider
          v-if="mainStore.settings.showInitialInfo || mainStore.settings.showInitialInfo == undefined"
        />
        <router-view></router-view>
      </main>
    </NLayoutContent>
    <NLayoutFooter text-sm p-2 text-gray-500 text-right>
      鄂ICP备2021019535号
    </NLayoutFooter>

    <n-modal v-model:show="showAbout" preset="dialog" title="关于">
      <template #header>
        <div>关于</div>
      </template>
      <div>
        <span>网站主要是给2022年专升本的同学报考院校提供帮助，非机构非盈利性质，切勿作其他用途！网站卡顿敬请谅解。</span>
        <a href="http://home.xxcheng.cn:29000/hbzsb/">友商</a>
        <h5 my-1>
          前端开源地址:
          <a
            href="https://github.com/Cyenoch/zsb-monitor-web"
          >https://github.com/Cyenoch/zsb-monitor-web</a>
        </h5>
        <h4>前端更新日志:</h4>
        <ul>
          <li>
            <span text-gray-400 mr-4>2022-04-03 16:24</span>
            <ol>
              <li>修复多个模块的若干问题，</li>
            </ol>
          </li>
          <li>
            <span text-gray-400 mr-4>2022-04-03 18:15</span>
            <ol>
              <li>
                <s>优化移动端表格显示效果</s>
              </li>
            </ol>
          </li>
          <li>
            <span text-gray-400 mr-4>2022-04-04 12:57</span>
            <ol>
              <li>
                <s>优化移动端表格显示效果</s>
              </li>
            </ol>
          </li>
          <li>
            <span text-gray-400 mr-4>2022-04-05 21:00</span>
            <ol>
              <li>细节优化</li>
            </ol>
          </li>
          <li>
            <span text-gray-400 mr-4>2022-04-07 11:00</span>
            <ol>
              <li>默认比对2022年4月7日早上7点的数据</li>
            </ol>
          </li>
          <li>
            <span text-gray-400 mr-4>2022-04-07 13:00</span>
            <ol>
              <li>修复排序卡死的问题</li>
            </ol>
          </li>
        </ul>
        <footer>
          <div>反馈bug或是有新的意见或建议 QQ: 3530224953 不接受不正当的商务合作、广告合作等，非盈利非机构</div>
          <div>
            如果您喜欢我的作品，有心赞助，可访问此处：
            <a
              href="https://afdian.net/@02dsk?tab=home"
            >https://afdian.net/@02dsk?tab=home</a>您赞助的资金将会用于给服务器上蓝BUFF，优化访问体验。
          </div>
          <div>作者：花海逐樱</div>
        </footer>
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
