import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Introduction',
      component: () => import('../views/home/index.vue')
    },
    {
      path: '/concept',
      name: 'Concept',
      component: () =>  import('../views/concept/index.vue')
    },
    {
      path: '/table',
      name: 'Table',
      component: () =>  import('../views/table/index.vue')
    },
    {
      path: '/select',
      name: 'Select',
      component: () =>  import('../views/select/index.vue')
    },
    {
      path: '/form',
      name: 'Form',
      component: () =>  import('../views/form/index.vue')
    },
    {
      path: '/tabs',
      name: 'Tabs',
      component: () =>  import('../views/tabs/index.vue')
    },
    {
      path: '/layout',
      name: 'Layout',
      component: () =>  import('../views/layout/index.vue')
    },
    {
      path: '/demoApp1',
      name: 'Demo App 1',
      component: () =>  import('../views/demoApp1/index.vue')
    },
    {
      path: '/test',
      name: 'Test',
      component: () =>  import('../views/test/index.vue')
    },
  ]
})

export default router
