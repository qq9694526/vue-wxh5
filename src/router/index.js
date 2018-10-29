import Index from '@/pages/Index'
import SignUp from '@/pages/SignUp'
import Home from '@/pages/Home'
import Register from '@/pages/Register'
import Admin from '@/pages/Admin'
import AdminPerformance from '@/components/AdminPerformance'
import AdminRankList from '@/components/AdminRankList'
import AdminCheck from '@/components/AdminCheck'

export default [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
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
      },
      {
        path: 'check',
        component: AdminCheck
      }
    ]
  }
]

