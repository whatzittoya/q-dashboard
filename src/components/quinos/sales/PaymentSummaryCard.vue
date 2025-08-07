<script setup>
import { computed } from 'vue'
import CardReport from '@/components/Table/CardReport.vue'
import { autoFormat } from '@/service/formatNumber'
const props = defineProps({
  items: { type: Object, default: () => ({}) }
})

const calculateTotalByDepartmment = (data) => {
  // Create a map to store totals
  const paymentTotals = new Map()
  let total_all = 0
  let total_quantity = 0
  // Iterate through the data array
  data.forEach((entry) => {
    const transactionLine = entry?.TransactionLine
    const paymentCode = transactionLine?.payment_code

    // If the paymentCode is not in the map, initialize it
    if (!paymentTotals.has(paymentCode)) {
      paymentTotals.set(paymentCode, {
        totalQuantity: 0,
        totalAmount: 0
      })
    }

    // Update totals for the current paymentCode
    paymentTotals.get(paymentCode).totalQuantity += transactionLine.quantity
    paymentTotals.get(paymentCode).totalAmount += parseFloat(transactionLine.amount)
    total_all += parseFloat(transactionLine.amount)

    total_quantity += parseFloat(transactionLine.quantity)
  })

  // Convert the map to an array of objects
  return Array.from(paymentTotals, ([paymentCode, totals]) => ({
    paymentCode,
    totalQuantity: autoFormat(totals.totalQuantity, getLabelByObj('totalQuantity').type),
    totalAmount: autoFormat(totals.totalAmount, getLabelByObj('totalAmount').type),
    fraction: autoFormat(totals.totalAmount / total_all, getLabelByObj('fraction').type)
  })).concat({
    paymentCode: 'Total',
    totalQuantity: autoFormat(total_quantity, getLabelByObj('totalQuantity').type),
    totalAmount: autoFormat(total_all, getLabelByObj('totalAmount').type),
    fraction: ''
  })
}

function getLabelByObj(filterObj) {
  const result = dataList.find((item) => item.obj === filterObj)

  return result ? result : null
}
const itemPayment = computed(() => {
  if (!props.items.isLoading) {
    return {
      isLoading: false,
      data: calculateTotalByDepartmment(props.items.data)
    }
  }
  return props.items
})

const dataList = [
  { label: 'paymentCode', obj: 'paymentCode', type: 'text' },
  { label: 'totalQuantity', obj: 'totalQuantity', type: 'number' },
  { label: 'fraction', obj: 'fraction', type: 'percent' },
  { label: 'totalAmount', obj: 'totalAmount', type: 'currency' }
]

defineExpose({ itemPayment })
</script>

<template>
  
      <CardReport :items="itemPayment" :data-list="dataList" title="Payment Method"></CardReport>

</template>
