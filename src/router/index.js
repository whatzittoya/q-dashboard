import { createRouter, createWebHashHistory } from 'vue-router'
import Style from '@/views/StyleView.vue'
import Home from '@/views/HomeView.vue'
import Transaction from '@/views/TransactionView.vue'
import TransactionMonthly from '@/views/TransactionMonthlyView.vue'
import SummarySales from '@/views/SummarySalesView.vue'
import ItemSales from '@/views/ItemSalesView.vue'
import SalesType from '@/views/SalesTypeView.vue'
import { isAuthenticated } from '@/service/auth'
import { useMainStore } from '@/stores/main'

const routes = [
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
      title: 'Item Sales Report'
    },
    path: '/item-sales',
    name: 'ItemSales',
    component: ItemSales
  },
  {
    meta: {
      title: 'Sales Type Report'
    },
    path: '/sales-type',
    name: 'SalesType',
    component: SalesType
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
      title: 'Login'
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
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
  const mainStore = useMainStore()
  const isAuth = isAuthenticated()
  if (to.name !== 'login' && !isAuth) {
    next({ name: 'login' }) // Redirect to login if not authenticated
  } else if (to.name == 'login' && isAuth) {
    next({ name: 'SummarySales' })
  } else if (to.name == 'member' && mainStore.user.role != 'admin') {
    next({ name: 'SummarySales' })
  } else {
    next() // Continue to the next route
  }
})

export default router
