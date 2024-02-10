/**
 * 基础路由
 * @type { *[] }
 */
import Settings from "@/views/Settings.vue";

const constantRouterMap = [
  {
    path: '/',
    name: 'Example',
    redirect: { name: 'ExampleHelloIndex' },
    children: [
      {
        path: '/example',
        name: 'ExampleHelloIndex',
        component: () => import('@/views/Main.vue')
      },
      {
        path: '/settings',
        name: 'Settings',
        // redirect: { name: 'Settings' },
        component: Settings
      },
    ]
  },

]

export default constantRouterMap
