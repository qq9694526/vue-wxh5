import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/pages/Index'
import Home from '@/pages/Home'
import Test from '@/pages/Test'
import Test1 from '@/pages/Test1'
import Register from '@/pages/Register'
import Admin from '@/pages/Admin'
import AdminPerformance from '@/components/AdminPerformance'
import AdminRankList from '@/components/AdminRankList'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/test1',
    name: 'Test1',
    component: Test1
  },
  {
    path: '/test',
    name: 'Test',
    component: Test
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    children: [
      {
        path: '',
        component: AdminPerformance
      },
      {
        path: 'performance',
        component: AdminPerformance
      },
      {
        path: 'ranklist',
        component: AdminRankList
      }
    ]
  }
]

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes
})
// router.beforeEach(function (to, from, next) {
//   //console.log(to,from,next)
//   //需求登录判断
//   if (/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)) {
//     location.href = location.origin + to.path
//   } else {
//     next();
//   }
// })

export default router