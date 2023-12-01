<script setup>
import GenericTable from '@/components/Table/GenericTable.vue'
import { computed, ref } from 'vue'
import { calculateGrandTotal } from '@/service/calculation'

const props = defineProps({
  items: { format: Object, default: () => ({}) }
})
const mapTransactions = (data) => {
  return data.map((item) => {
    const transaction = item?.Transaction
    return {
      ...transaction,
      avg_pax: parseFloat(transaction?.total / transaction?.pax),
      avg_trans: parseFloat(transaction?.total / transaction?.quantity)
    }
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
  { label: 'Sales Type', obj: 'sales_type', format: 'text' },
  { label: 'Subtotal', obj: 'subtotal', format: 'currency' },
  { label: 'Total', obj: 'total', format: 'currency' },
  { label: 'Pax', obj: 'pax', format: 'number' },
  { label: 'Tot Transaction', obj: 'quantity', format: 'number' },
  { label: 'Avg Per Pax', obj: 'avg_pax', format: 'number' },
  { label: 'Avg Per Transaction', obj: 'avg_trans', format: 'currency' }
]
</script>

<template>
      <GenericTable :items="itemSummary" :data-attr="dataList" title="Sales Type" :has-paging="false" :has-edit="false" ></GenericTable>
</template>
