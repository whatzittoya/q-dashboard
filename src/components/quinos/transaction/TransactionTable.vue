<script setup>
import { computed, ref } from 'vue'
import { useMainStore } from '@/stores/main'

import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import TableLoading from '@/components/quinos/skeleton/TableLoading.vue'
import MainTable from '@/components/Table/MainTable.vue'

defineProps({
  checkable: Boolean
})

const mainStore = useMainStore()

//const items = computed(() => mainStore.clients)
const items = computed(() => {
  return mainStore.apiData.transaction_daily
})

const perPage = ref(20)

const currentPage = ref(0)

const itemsPaginated = computed(() =>
  items.value.data.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
)

const numPages = computed(() => Math.ceil(items.value.data.length / perPage.value))

const currentPageHuman = computed(() => currentPage.value + 1)

const pagesList = computed(() => {
  const pagesList = []

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})

const data_attr = [
  {
    label: 'Date',
    obj: 'date',
    format: 'text'
  },
  {
    label: 'Store',
    obj: 'brand',
    format: 'text'
  },
  {
    label: 'Type',
    obj: 'sales_type',
    format: 'text'
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
    label: 'Net Sales',
    obj: 'netsales',
    format: 'currency'
  },
  {
    label: 'Serv Chg"',
    obj: 'service_charge',
    format: 'currency'
  },
  {
    label: 'Tax',
    obj: 'tax',
    format: 'text'
  },
  {
    label: 'Rounding',
    obj: 'rounding',
    format: 'currency'
  },
  {
    label: 'Total',
    obj: 'total',
    format: 'currency'
  }
]
</script>

<template>
  <MainTable :items="items" :data-attr="data_attr"></MainTable>
</template>
