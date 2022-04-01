import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router';
import { Chart, registerables } from 'chart.js';
import App from './App.vue'
import 'uno.css'

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
      component: () => import('./views/IndexPanel.vue'),
      children: [{
        name: 'university-panel',
        path: 'university-panel',
        component: () => import('./views/UniversityPanel.vue')
      }]
    }]
  }]
}));

app.mount('#app')
