<script setup>
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import BaseButton from '@/components/BaseButton.vue'
import NotificationBarInCard from '@/components/NotificationBarInCard.vue'
import { autoFormat } from '@/service/formatNumber'
import { useMainStore } from '@/stores/main'
import { computed } from 'vue'
import GenericTable from '@/components/Table/GenericTable.vue'
import CardReport from '@/components/Table/CardReport.vue'

const props = defineProps({
  items: { type: Object, default: () => ({}) }
})

const dataList = [
  { label: 'Subtotal', obj: 'subtotal', type: 'currency' },
  { label: 'Discount', obj: 'discount', type: 'currency' },
  { label: 'Service Charge', obj: 'service_charge', type: 'percent' },
  { label: 'Tax', obj: 'tax', type: 'currency' },
  { label: 'Rounding', obj: 'rounding', type: 'currency' }
]
</script>

<template>
      <CardReport :items="items" :data-list="dataList" title="Summary Sales"></CardReport>
</template>
