import Index from '@/pages/Index'
import Admin from '@/pages/Admin'
import AdminPerformance from '@/components/AdminPerformance'
import AdminRankList from '@/components/AdminRankList'



export default [
  {
    path: '/',
    name: 'Index',
    component: Index
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

