import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ResultPage from '../pages/ResultPage.vue'
import SelectPage from '../pages/SelectPage.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/select', component: SelectPage },
    { path: '/result', component: ResultPage },
  ],
})

export default router
