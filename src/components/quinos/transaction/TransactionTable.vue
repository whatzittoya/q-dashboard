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
    obj: 'date'
  },
  {
    label: 'Store',
    obj: 'brand'
  },
  {
    label: 'Type',
    obj: 'sales_type'
  },
  {
    label: 'Subtotal',
    obj: 'subtotal'
  },
  {
    label: 'Discount',
    obj: 'discount'
  },
  {
    label: 'Net Sales',
    obj: 'netsales'
  },
  {
    label: 'Serv Chg"',
    obj: 'service_charge'
  },
  {
    label: 'Tax',
    obj: 'tax'
  },
  {
    label: 'Rounding',
    obj: 'rounding'
  },
  {
    label: 'Total',
    obj: 'total'
  }
]
</script>

<template>
  <MainTable :items="items" :data-attr="data_attr"></MainTable>
</template>
