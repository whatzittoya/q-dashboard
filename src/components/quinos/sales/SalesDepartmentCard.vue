<script setup>
import { computed } from 'vue'
import CardReport from '@/components/Table/CardReport.vue'
import { autoFormat } from '@/service/formatNumber'
const props = defineProps({
  items: { type: Object, default: () => ({}) }
})

const calculateTotalByDepartmment = (data) => {
  // Create a map to store totals
  const departmentTotals = new Map()
  let total_all = 0
  // Iterate through the data array
  data.forEach((entry) => {
    const transactionLine = entry?.TransactionLine
    const departmentCode = transactionLine?.department_code

    // If the departmentCode is not in the map, initialize it
    if (!departmentTotals.has(departmentCode)) {
      departmentTotals.set(departmentCode, {
        totalQuantity: 0,
        totalRevenue: 0,
        totalTax: 0
      })
    }

    // Update totals for the current departmentCode
    departmentTotals.get(departmentCode).totalQuantity += transactionLine.quantity
    departmentTotals.get(departmentCode).totalRevenue += transactionLine.revenue
    total_all += transactionLine.revenue
  })

  // Convert the map to an array of objects
  return Array.from(departmentTotals, ([departmentCode, totals]) => ({
    departmentCode,
    totalQuantity: autoFormat(totals.totalQuantity, getLabelByObj('totalQuantity').type),
    totalRevenue: autoFormat(totals.totalRevenue, getLabelByObj('totalRevenue').type),
    fraction: autoFormat(totals.totalRevenue / total_all, getLabelByObj('fraction').type)
  })).concat({
    departmentCode: 'Total',
    totalRevenue: autoFormat(total_all, getLabelByObj('totalRevenue').type)
  })
}

function getLabelByObj(filterObj) {
  const result = dataList.find((item) => item.obj === filterObj)

  return result ? result : null
}
const itemSales = computed(() => {
  if (!props.items.isLoading) {
    return {
      isLoading: false,
      data: calculateTotalByDepartmment(props.items.data)
    }
  }
  return props.items
})

const dataList = [
  { label: 'departmentCode', obj: 'departmentCode', type: 'text' },
  { label: 'totalQuantity', obj: 'totalQuantity', type: 'number' },
  { label: 'fraction', obj: 'fraction', type: 'percent' },
  { label: 'totalRevenue', obj: 'totalRevenue', type: 'currency' }
]
</script>

<template>
      <CardReport :items="itemSales" :data-list="dataList" title="Sales Per Department"></CardReport>

</template>
