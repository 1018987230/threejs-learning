import { createRouter,createWebHashHistory, } from "vue-router";

const router = createRouter({
    history: createWebHashHistory(),
    // mode:'history',
    routes: [
        {
            path: '/',
            name: 'test01',
            component: () => import(/*webpackChunkName: "home" */ '../views/test01.vue')
        },
        {
            path: '/test02',
            name: 'test02',
            component: () => import(/*webpackChunkName: "home" */ '../views/test02.vue')
        },

        {
            path: '/demo01',
            name: 'demo01',
            component: () => import(/*webpackChunkName: "home" */ '../views/demo01.vue')
        },
        {
            path: '/demo02',
            name: 'demo02',
            component: () => import(/*webpackChunkName: "home" */ '../views/demo02.vue')
        },
        // admin router
        

    ]
})
export default router
