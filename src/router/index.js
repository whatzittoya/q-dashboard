import { createRouter, createWebHashHistory } from 'vue-router'
import Style from '@/views/StyleView.vue'
import Home from '@/views/HomeView.vue'
import Transaction from '@/views/TransactionView.vue'
import TransactionMonthly from '@/views/TransactionMonthlyView.vue'
import SummarySales from '@/views/SummarySalesView.vue'
import { isAuthenticated } from '@/service/auth'

const routes = [
  {
    meta: {
      title: 'Select style'
    },
    path: '/',
    name: 'style',
    component: Style
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Dashboard'
    },
    path: '/dashboard',
    name: 'dashboard',
    component: Home
  },
  {
    meta: {
      title: 'Transaction'
    },
    path: '/transaction',
    name: 'Transaction',
    component: Transaction
  },
  {
    meta: {
      title: 'Transaction Monthly'
    },
    path: '/transaction-monthly',
    name: 'TransactionMonnthly',
    component: TransactionMonthly
  },
  {
    meta: {
      title: 'Summary Sales Report'
    },
    path: '/summary-sales',
    name: 'SummarySales',
    component: SummarySales
  },
  {
    meta: {
      title: 'Tables'
    },
    path: '/tables',
    name: 'tables',
    component: () => import('@/views/TablesView.vue')
  },
  {
    meta: {
      title: 'Forms'
    },
    path: '/forms',
    name: 'forms',
    component: () => import('@/views/FormsView.vue')
  },
  {
    meta: {
      title: 'Profile'
    },
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue')
  },
  {
    meta: {
      title: 'Ui'
    },
    path: '/ui',
    name: 'ui',
    component: () => import('@/views/UiView.vue')
  },
  {
    meta: {
      title: 'Responsive layout'
    },
    path: '/responsive',
    name: 'responsive',
    component: () => import('@/views/ResponsiveView.vue')
  },
  {
    meta: {
      title: 'Login'
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    meta: {
      title: 'Error'
    },
    path: '/error',
    name: 'error',
    component: () => import('@/views/ErrorView.vue')
  },
  {
    meta: {
      title: 'Manage Member'
    },
    path: '/member',
    name: 'member',
    component: () => import('@/views/ManageMemberView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})
router.beforeEach((to, from, next) => {
  const isAuth = isAuthenticated()
  console.log(to.name, isAuth)
  if (to.name !== 'login' && !isAuth) {
    next({ name: 'login' }) // Redirect to login if not authenticated
  } else if (to.name == 'login' && isAuth) {
    next({ name: 'dashboard' })
  } else {
    next() // Continue to the next route
  }
})

export default router
