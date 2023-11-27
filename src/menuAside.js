import {
  mdiAccountCircle,
  mdiMonitor,
  mdiGithub,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiTelevisionGuide,
  mdiResponsive,
  mdiPalette,
  mdiReact,
  mdiAccount,
  mdiCurrencyUsd,
  mdiChartBar
} from '@mdi/js'

export default [
  // {
  //   to: '/dashboard',
  //   icon: mdiMonitor,
  //   label: 'Dashboard'
  // },
  {
    to: '/transaction',
    icon: mdiCurrencyUsd,
    label: 'Transaction'
  },
  {
    to: '/transaction-monthly',
    icon: mdiCurrencyUsd,
    label: 'Transaction Monthly'
  },
  {
    to: '/summary-sales',
    icon: mdiTable,
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
    to: '/member',
    icon: mdiAccount,
    label: 'Manage Member'
  },
  {
    to: '/tables',
    label: 'Tables',
    icon: mdiTable
  },
  {
    to: '/forms',
    label: 'Forms',
    icon: mdiSquareEditOutline
  },
  {
    to: '/ui',
    label: 'UI',
    icon: mdiTelevisionGuide
  },
  {
    to: '/responsive',
    label: 'Responsive',
    icon: mdiResponsive
  },
  {
    to: '/',
    label: 'Styles',
    icon: mdiPalette
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: mdiAccountCircle
  },
  {
    to: '/login',
    label: 'Login',
    icon: mdiLock
  },
  {
    to: '/error',
    label: 'Error',
    icon: mdiAlertCircle
  },
  {
    label: 'Dropdown',
    icon: mdiViewList,
    menu: [
      {
        label: 'Item One'
      },
      {
        label: 'Item Two'
      }
    ]
  },
  {
    href: 'https://github.com/justboil/admin-one-vue-tailwind',
    label: 'GitHub',
    icon: mdiGithub,
    target: '_blank'
  },
  {
    href: 'https://github.com/justboil/admin-one-react-tailwind',
    label: 'React version',
    icon: mdiReact,
    target: '_blank'
  }
]
