<script setup>
import { computed } from 'vue'
import CardReport from '@/components/Table/CardReport.vue'
import { autoFormat } from '@/service/formatNumber'
const props = defineProps({
  items: { type: Object, default: () => ({}) }
})

const itemDiscount = computed(() => {
  if (!props.items.isLoading) {
    return {
      isLoading: false,
      data: mapDiscount(props.items.data)
    }
  }
  return props.items
})
const mapDiscount = (data) => {
  return data.map((item) => {
    const transaction = item?.TransactionLine
    return {
      ...transaction
    }
  })
}
const dataList = [
  { label: 'discount_code', obj: 'discount_code', format: 'text' },
  { label: 'quantity', obj: 'quantity', format: 'number' },
  { label: 'amount', obj: 'amount', format: 'currency' }
]
</script>

<template>
      <CardReport :items="itemDiscount" :data-list="dataList" title="Discounts"></CardReport>

</template>
