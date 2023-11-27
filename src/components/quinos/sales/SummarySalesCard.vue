<script setup>
import CardReport from '@/components/Table/CardReport.vue'
import { computed, ref } from 'vue'
import { calculateGrandTotal } from '@/service/calculation'

const props = defineProps({
  items: { type: Object, default: () => ({}) }
})
const name = ref('child component')
const appendTotal = (data) => {
  const propertiesToSum = ['subtotal', 'discount', 'service_charge', 'tax', 'rounding']
  const grandTotal = calculateGrandTotal(data, propertiesToSum)
  data['grand_total'] = grandTotal
  return data
}
const itemSummary = computed(() => {
  if (!props.items.isLoading) {
    return {
      isLoading: false,
      data: appendTotal(props.items.data)
    }
  }
  return props.items
})

const dataList = [
  { label: 'Subtotal', obj: 'subtotal', type: 'currency' },
  { label: 'Discount', obj: 'discount', type: 'currency' },
  { label: 'Service Charge', obj: 'service_charge', type: 'currency' },
  { label: 'Tax', obj: 'tax', type: 'currency' },
  { label: 'Rounding', obj: 'rounding', type: 'currency' },
  { label: 'Grand Total', obj: 'grand_total', type: 'currency' }
]
defineExpose({
  itemSummary
})
</script>

<template>
      <CardReport :items="itemSummary" :data-list="dataList" title="Revenue" :transformed="true"></CardReport>
</template>
