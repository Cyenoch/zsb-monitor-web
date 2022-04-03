import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router';
import { Chart, registerables } from 'chart.js';
import App from './App.vue'
import 'uno.css'
import 'moment/dist/locale/zh-cn'
// 通用字体
import 'vfonts/Roboto.css'
// 等宽字体
import 'vfonts/FiraCode.css'

Chart.register(...registerables);

const app = createApp(App);

app.use(createRouter({
  history: createWebHashHistory(),
  routes: [{
    path: '/',
    component: () => import('./views/Home.vue'),
    children: [{
      path: '',
      redirect: '/index',
    }, {
      path: '/index',
      name: 'index',
      component: () => import('./views/Majors.vue'),
      children: [{
        name: 'university-panel',
        path: 'university-panel',
        component: () => import('./views/UniversityPanel.vue')
      }]
    }, {
      name: 'universities',
      path: 'universities',
      component: () => import('./views/Universities.vue')
    }, {
      name: 'majors',
      path: 'majors',
      component: () => import('./views/Majors.vue')
    }]
  }]
}));

app.mount('#app')
