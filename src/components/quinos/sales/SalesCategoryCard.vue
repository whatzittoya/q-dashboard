<script setup>
import { computed } from 'vue'
import CardReport from '@/components/Table/CardReport.vue'
import { autoFormat, formatCurrency } from '@/service/formatNumber'
const props = defineProps({
  items: { type: Object, default: () => ({}) }
})

const calculateTotalByCategory = (data) => {
  // Create a map to store totals
  const categoryTotals = new Map()
  let total_all = 0
  // Iterate through the data array
  data.forEach((entry) => {
    const transactionLine = entry?.TransactionLine
    const categoryCode = transactionLine?.category_code
    const departmentCode = transactionLine?.department_code

    // If the categoryCode is not in the map, initialize it
    if (!categoryTotals.has(categoryCode)) {
      categoryTotals.set(categoryCode, {
        departmentCode,
        totalQuantity: 0,
        totalRevenue: 0,
        totalTax: 0
      })
    }

    // Update totals for the current categoryCode
    categoryTotals.get(categoryCode).totalQuantity += transactionLine.quantity
    categoryTotals.get(categoryCode).totalRevenue += transactionLine.revenue
    total_all += transactionLine.revenue
  })

  // Convert the map to an array of objects
  return Array.from(categoryTotals, ([categoryCode, totals]) => ({
    categoryCode,
    departmentCode: totals.departmentCode,
    totalQuantity: autoFormat(totals.totalQuantity, getLabelByObj('totalQuantity').type),
    totalRevenue: autoFormat(totals.totalRevenue, getLabelByObj('totalRevenue').type),
    fraction: autoFormat(totals.totalRevenue / total_all, getLabelByObj('fraction').type)
  }))
}
function transformData(inputData) {
  const sortedData = inputData.sort((a, b) => (a.departmentCode > b.departmentCode ? 1 : -1))

  const transformedData = []

  sortedData.forEach((item) => {
    const categoryIndex = transformedData.findIndex(
      (category) => category.categoryCode === item.departmentCode
    )

    if (categoryIndex === -1) {
      transformedData.push({ categoryCode: item.departmentCode })
    }

    transformedData.push({ ...item })
  })
  // Add row count for the last category
  if (transformedData.length > 0) {
    transformedData.push({ categoryCode: 'Total', totalRevenue: '0' })
  }

  return transformedData
}
function transformData1(inputData) {
  const sortedData = inputData.sort((a, b) => (a.departmentCode > b.departmentCode ? 1 : -1))

  const transformedData = []
  let currentDepartment = null
  let rowTotal = 0

  sortedData.forEach((item) => {
    if (item.departmentCode !== currentDepartment) {
      // Add a new category
      if (currentDepartment !== null) {
        transformedData.push({
          categoryCode: `Total ${currentDepartment}`,
          totalRevenue: formatCurrency(rowTotal)
        })
      }
      transformedData.push({ categoryCode: item.departmentCode, totalRevenue: '' })
      currentDepartment = item.departmentCode
      rowTotal = 0
    }

    // Add item to the category
    transformedData.push({ ...item })
    rowTotal += parseFloat(item.totalRevenue.replaceAll(',', ''))
  })

  // Add row count for the last category
  if (currentDepartment !== null) {
    transformedData.push({
      categoryCode: `Total ${currentDepartment}`,
      totalRevenue: formatCurrency(rowTotal)
    })
  }

  return transformedData
}

function getLabelByObj(filterObj) {
  const result = dataList.find((item) => item.obj === filterObj)

  return result ? result : null
}
const itemSales = computed(() => {
  if (!props.items.isLoading) {
    return {
      isLoading: false,
      data: transformData1(calculateTotalByCategory(props.items.data))
    }
  }
  return props.items
})

const dataList = [
  { label: 'categoryCode', obj: 'categoryCode', type: 'text' },
  { label: 'totalQuantity', obj: 'totalQuantity', type: 'number' },
  { label: 'fraction', obj: 'fraction', type: 'percent' },
  { label: 'totalRevenue', obj: 'totalRevenue', type: 'currency' }
]
</script>

<template>
      <CardReport :items="itemSales" :data-list="dataList" title="Sales Per Category"></CardReport>

</template>
