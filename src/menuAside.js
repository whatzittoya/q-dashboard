import {
  mdiAccountCircle,
  mdiViewDashboard,
  mdiAccount,
  mdiCurrencyUsd,
  mdiChartBar,
  mdiTimeline,
  mdiTable
} from '@mdi/js'

export default [
  // {
  //   to: '/dashboard',
  //   icon: mdiMonitor,
  //   label: 'Dashboard'
  // },

  {
    to: '/summary-sales',
    icon: mdiViewDashboard,
    label: 'Summary Sales Report'
  },
  {
    to: '/sales-type',
    icon: mdiTable,
    label: 'Sales Type Report'
  },
  {
    to: '/item-sales',
    icon: mdiChartBar,
    label: 'Item Sales Report'
  },
  {
    to: '/transaction',
    icon: mdiCurrencyUsd,
    label: 'Transaction'
  },
  {
    to: '/transaction-monthly',
    icon: mdiTimeline,
    label: 'Transaction Monthly'
  },
  {
    to: '/member',
    icon: mdiAccount,
    label: 'Manage Member',
    role: 'admin'
  },

  {
    to: '/profile',
    label: 'Profile',
    icon: mdiAccountCircle
  }
]
