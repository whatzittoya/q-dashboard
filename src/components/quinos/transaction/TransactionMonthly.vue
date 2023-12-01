<script setup>
import { computed } from 'vue'
import { useMainStore } from '@/stores/main'

import MainTable from '@/components/Table/MainTable.vue'
defineProps({
  checkable: Boolean
})

const mainStore = useMainStore()

const items = computed(() => {
  return mainStore.apiData.transaction_monthly
})

const data_attr = [
  {
    label: 'Year',
    obj: 'yy'
  },
  {
    label: 'Month',
    obj: 'mm'
  },
  {
    label: 'Quantity',
    obj: 'quantity',
    format: 'number'
  },
  {
    label: 'Subtotal',
    obj: 'subtotal',
    format: 'currency'
  },
  {
    label: 'Discount',
    obj: 'discount',
    format: 'currency'
  },
  {
    label: 'Serv Chg',
    obj: 'service_charge',
    format: 'currency'
  },
  {
    label: 'Tax',
    obj: 'tax',
    format: 'currency'
  },
  {
    label: 'Total',
    obj: 'total',
    format: 'number'
  }
]
</script>

<template>
  <MainTable :items="items" :data-attr="data_attr"></MainTable>
</template>
