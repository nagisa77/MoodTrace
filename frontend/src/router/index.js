import { createRouter, createWebHistory } from 'vue-router'
import LogListView from '../views/LogListView.vue'
import NewLogView from '../views/NewLogView.vue'
import LogDetailView from '../views/LogDetailView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'logs',
      component: LogListView,
    },
    {
      path: '/new',
      name: 'new-log',
      component: NewLogView,
    },
    {
      path: '/log/:id',
      name: 'log-detail',
      component: LogDetailView,
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
})

export default router
