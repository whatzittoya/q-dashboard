import {
  mdiAccountCircle,
  mdiViewDashboard,
  mdiAccount,
  mdiCurrencyUsd,
  mdiChartBar,
  mdiTimeline,
  mdiTable,
  mdiAlert,
  mdiBoxCutterOff,
  mdiBox,
  mdiCubeUnfolded,
  mdiPackageVariant,
  mdiWarehouse,
  mdiNumeric0Box,
  mdiSync,
} from "@mdi/js";

export default [
  // {
  //   to: '/dashboard',
  //   icon: mdiMonitor,
  //   label: 'Dashboard'
  // },
  {
    to: "/dashboard-consolidate",
    icon: mdiTimeline,
    label: "Dashboard Consolidate",
    notvisible: "expat",
  },
  {
    to: "/daily-transaction",
    icon: mdiTimeline,
    label: "Daily Transaction",
    visibleonly: "expat",
  },
  {
    to: "/summary-sales",
    icon: mdiViewDashboard,
    label: "Summary Sales Report",
  },
  {
    to: "/sales-type",
    icon: mdiTable,
    label: "Sales Type Report",
  },
  {
    to: "/item-sales",
    icon: mdiChartBar,
    label: "Item Sales Report",
  },
  {
    to: "/transaction",
    icon: mdiCurrencyUsd,
    label: "Transaction",
  },
  {
    to: "/transaction-monthly",
    icon: mdiTimeline,
    label: "Transaction Monthly",
  },
  {
    label: "Warehouse",
    icon: mdiWarehouse,
    type: "dropdown",
    menu: [
      {
        to: "/stock-movement",
        icon: mdiPackageVariant,
        label: "Stock Movement",
      },
      {
        to: "/warehouse",
        icon: mdiWarehouse,
        label: "Warehouse List",
      },
      {
        to: "/stock-level",
        icon: mdiNumeric0Box,
        label: "Stock Level",
      },
      {
        to: "/sync-stock-movement",
        icon: mdiSync,
        label: "Sync Stock Movement",
      },
    ],
  },

  {
    to: "/member",
    icon: mdiAccount,
    label: "Manage Member",
    role: "admin",
  },
  {
    to: "/member",
    icon: mdiAccount,
    label: "Manage Member",
    role: "super-admin",
  },

  {
    to: "/profile",
    label: "Profile",
    icon: mdiAccountCircle,
  },

  {
    to: "/client",
    label: "Client",
    icon: mdiAlert,
    role: "super-admin",
    color: "bg-yellow-400",
  },
];
