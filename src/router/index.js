import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import Transaction from '@/views/TransactionView.vue'
import TransactionMonthly from '@/views/TransactionMonthlyView.vue'
import SummarySales from '@/views/SummarySalesView.vue'
import ItemSales from '@/views/ItemSalesView.vue'
import SalesType from '@/views/SalesTypeView.vue'
import { getRole, isAuthenticated } from '@/service/auth'
import { useMainStore } from '@/stores/main'
import Consolidate from '@/views/ConsolidateView.vue'
import DailyTransaction from '@/views/DailyTransactionView.vue'
const routes = [
  {
    meta: {
      title: 'Dashboard Consolidate'
    },
    path: '/dashboard-consolidate',
    name: 'Consolidate',
    component: Consolidate
  },
   {
    meta: {
      title: 'Summary Sales'
    },
    path: '/summary-sales',
    name: 'SummarySales',
    component: SummarySales
  },
  { 
    meta: {
      title: 'Daily Transaction'
    },
    path: '/daily-transaction',
    name: 'DailyTransaction',
    component: DailyTransaction
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
      title: 'Stock Movement'
    },
    path: '/stock-movement',
    name: 'StockMovement',
    component: () => import('@/views/StockMovement.vue')
  },
  {
    meta: {
      title: 'Warehouse List'
    },
    path: '/warehouse',
    name: 'WarehouseList',
    component: () => import('@/views/WarehouseListView.vue')
  },
  {
    meta: {
      title: 'Stock Level'
    },
    path: '/stock-level',
    name: 'StockLevel',
    component: () => import('@/views/StockLevelView.vue')
  },
  {
    meta: {
      title: 'Sync Stock Movement'
    },
    path: '/sync-stock-movement',
    name: 'SyncStockMovement',
    component: () => import('@/views/SyncStockMovementView.vue')
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
  ,
  {
    meta: {
      title: 'Manage Clients'
    },
    path: '/client',
    name: 'client',
    component: () => import('@/views/ManageClientView.vue')
  }
  ,
  {
    meta: {
      title: 'Manage Store'
    },
    path: '/client/:client/store',
    name: 'store',
    component: () => import('@/views/ManageStoreView.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})
router.beforeEach((to, from, next) => {
  const isAuth = isAuthenticated()
  if (to.name !== 'login' && !isAuth) {
    next({ name: 'login' }) // Redirect to login if not authenticated
  } else if (to.name == 'login' && isAuth) {
    next({ name: 'SummarySales' })
  } else if (to.name == 'member' && (getRole() != 'admin' && getRole() != 'super-admin')) {
    
    next({ name: 'SummarySales' })
  } else if ((to.name == 'store' || to.name == 'client') && (getRole() != 'super-admin')) {
    next({ name: 'SummarySales' })
  }else if (to.path == '/') {
    next({ name: 'login' })
  } else {
    next() // Continue to the next route
  }
})

export default router
