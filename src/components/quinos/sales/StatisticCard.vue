<script setup>
import CardReport from '@/components/Table/CardReport.vue'
import { computed, ref } from 'vue'

const props = defineProps({
  items: { type: Object, default: () => ({}) }
})

const itemSummary = computed(() => {
  if (!props.items.isLoading) {
    return {
      isLoading: false,
      data: props.items.data
    }
  }
  return props.items
})

const dataList = [
  { label: 'Grand Total', obj: 'grand_total', type: 'currency' },
  { label: 'Num Transaction', obj: 'num_transaction', type: 'number' },
  { label: 'Average Transaction', obj: 'avg_transaction', type: 'number' },
  { label: 'Total Guest', obj: 'total_guest', type: 'number' },
  { label: 'Average per pax', obj: 'avg_pax', type: 'number' },
  { label: 'average net per pax', obj: 'average_net_pax', type: 'number' }
]
</script>

<template>
      <CardReport :items="itemSummary" :data-list="dataList" title="Statistic" :transformed="true"></CardReport>
</template>
