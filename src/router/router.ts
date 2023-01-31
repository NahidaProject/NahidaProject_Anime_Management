import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import Anime from '../pages/Main/Main.vue'
import Login from '../pages/Login/Login.vue'
import Register from '../pages/Register/Register.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: Login,
        meta: {
            title: '登录'
        }
    },
    {
        path: '/index',
        component: Anime,
        meta: {
            title: 'Nahida Anime后台管理系统'
        }
    },
    {
        path: '/register',
        component: Register,
        meta: {
            title: '注册'
        }
    }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title as string
    }
    next()
})

export default router