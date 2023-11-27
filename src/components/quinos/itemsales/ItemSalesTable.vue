<script setup>
import { computed } from 'vue'
import { useMainStore } from '@/stores/main'

import GroupedTable from '@/components/Table/GroupedTable.vue'
const props = defineProps({
  items: { type: Object, default: () => ({}) }
})

const mainStore = useMainStore()
mainStore.fetchMember()

const data_attr = [
  {
    label: 'Item Code',
    obj: 'item_code',
    format: 'text'
  },
  {
    label: 'Description',
    obj: 'description',
    format: 'text'
  },
  {
    label: 'Quantity',
    obj: 'quantity',
    format: 'number'
  },
  {
    label: 'Revenue',
    obj: 'revenue',
    format: 'currency'
  },
  {
    label: 'Discount',
    obj: 'discount',
    format: 'currency'
  },
  {
    label: 'Service Charge',
    obj: 'service_charge',
    format: 'currency'
  },
  {
    label: 'Tax',
    obj: 'tax',
    format: 'currency'
  }
]

const groupItem = (item) => {
  const groupedArray = item.reduce((result, item) => {
    const existingItem = result.find((group) => group.title === item.category_code)

    if (existingItem) {
      // Update existing item
      existingItem.items.push({
        item_code: item.item_code,
        description: item.description,
        quantity: item.quantity,
        revenue: item.revenue,
        discount: item.discount,
        service_charge: item.service_charge,
        tax: item.tax
      })

      existingItem.quantity += parseFloat(item.quantity)
      existingItem.revenue += parseFloat(item.revenue)
      existingItem.discount += parseFloat(item.discount)
      existingItem.service_charge += parseFloat(item.service_charge)
      existingItem.tax += parseFloat(item.tax)
    } else {
      // Add new item
      result.push({
        title: item.category_code,
        items: [
          {
            item_code: item.item_code,
            description: item.description,
            quantity: item.quantity,
            revenue: item.revenue,
            discount: item.discount,
            service_charge: item.service_charge,
            tax: item.tax
          }
        ],
        item_code: 'TOTAL',

        quantity: parseFloat(item.quantity),
        revenue: parseFloat(item.revenue),
        discount: parseFloat(item.discount),
        service_charge: parseFloat(item.service_charge),
        tax: parseFloat(item.tax)
      })
    }

    return result
  }, [])

  groupedArray.sort((a, b) => a.title.localeCompare(b.title))
  let totalRevenue = 0
  let totalQuantity = 0
  let totalService = 0
  let totalTax = 0
  let totalDiscount = 0

  groupedArray.forEach((item) => {
    totalRevenue += parseFloat(item.revenue)
    totalQuantity += parseFloat(item.quantity)
    totalService += parseFloat(item.service_charge)
    totalDiscount += parseFloat(item.discount)
    totalTax += parseFloat(item.tax)
  })
  let totalEntry = {
    item_code: 'GRAND TOTAL',
    quantity: totalQuantity,
    revenue: totalRevenue,
    discount: totalDiscount,
    service_charge: totalService,
    tax: totalTax
  }
  groupedArray.push(totalEntry)
  return groupedArray
}
const itemSales = computed(() => {
  const data = props.items.data.map((item) => item.TransactionLine)
  return { isLoading: props.items.islLoading, data: groupItem(data) }
})
</script>

<template>
  <GroupedTable :items="itemSales" :data-attr="data_attr" :has-edit="false" :has-header="true"></GroupedTable>

</template>
