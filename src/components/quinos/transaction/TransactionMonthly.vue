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
    obj: 'quantity'
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
    label: 'Serv Chg',
    obj: 'service_charge'
  },
  {
    label: 'Tax',
    obj: 'tax'
  },
  {
    label: 'Total',
    obj: 'total'
  }
]
</script>

<template>
  <MainTable :items="items" :data-attr="data_attr"></MainTable>
  <!-- <table>
    <thead>
      <tr>
        <th v-for="d in data_attr" :key="d.label">{{ d.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="data in itemsPaginated" :key="data.Transaction.id">

        <td v-for="d in data_attr" :key="d.obj" :data-label="d.obj">
          {{ data.Transaction[d.obj]}}
        </td>
      
      </tr>
      <TableLoading v-if="items.isLoading" num-col=8></TableLoading>

    </tbody>
  </table>
  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
    <BaseLevel>
      <BaseButtons>
        <BaseButton
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="currentPage = page"
        />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </BaseLevel>
  </div> -->
</template>
