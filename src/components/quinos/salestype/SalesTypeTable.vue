<script setup>
import GenericTable from '@/components/Table/GenericTable.vue'
import { computed, ref } from 'vue'
import { calculateGrandTotal } from '@/service/calculation'

const props = defineProps({
  items: { type: Object, default: () => ({}) }
})
const mapTransactions = (data) => {
  return data.map((item) => {
    return item.Transaction
  })
}
const itemSummary = computed(() => {
  if (!props.items.isLoading) {
    return {
      isLoading: false,
      data: mapTransactions(props.items.data)
    }
  }
  return props.items
})

const dataList = [
  { label: 'Sales Type', obj: 'sales_type', type: 'currency' },
  { label: 'Subtotal', obj: 'subtotal', type: 'currency' },
  { label: 'Total', obj: 'total', type: 'currency' },
  { label: 'Pax', obj: 'pax', type: 'currency' }
]
</script>

<template>
      <GenericTable :items="itemSummary" :data-attr="dataList" title="Sales Type" :has-paging="false" :has-edit="false" ></GenericTable>
</template>
