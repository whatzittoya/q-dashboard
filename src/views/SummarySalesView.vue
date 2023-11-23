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
import SummarySalesCard from '@/components/quinos/sales/SummarySalesCard.vue'

const mainStore = useMainStore()
mainStore.fetchSummarySales('2023-11-20', '2023-11-21', 'all')

const dataList = [
  { label: 'Subtotal', obj: 'subtotal', type: 'currency' },
  { label: 'Discount', obj: 'discount', type: 'currency' },
  { label: 'Service Charge', obj: 'service_charge', type: 'percent' },
  { label: 'Tax', obj: 'tax', type: 'currency' },
  { label: 'Rounding', obj: 'rounding', type: 'currency' }
]
function getLabelByObj(filterObj) {
  const result = dataList.find((item) => item.obj === filterObj)

  return result ? result : null
}
const summarySalesItems = computed(() => {
  if (!mainStore.apiData.summary_sales.isLoading) {
    return { isLoading: false, data: mainStore.apiData.summary_sales.data[0].Transaction }
  }
  return mainStore.apiData.summary_sales
})

const summarySales = computed(() => {
  if (!mainStore.apiData.summary_sales.isLoading) {
    const newArray = Object.entries(mainStore.apiData.summary_sales.data[0].Transaction)
      .map(([label, val]) => {
        if (getLabelByObj(label) !== null) {
          const labelByObj = getLabelByObj(label)
          return {
            label: labelByObj.label,
            obj: autoFormat(val, labelByObj.type) // Convert the value to an integer
          }
        }
      })
      .filter(Boolean)
    return { isLoading: false, data: newArray }
  }
  return mainStore.apiData.summary_sales
})
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain class="flex flex-wrap">
      <SummarySalesCard :items="summarySalesItems"></SummarySalesCard>
 

    </SectionMain>
  </LayoutAuthenticated>
</template>
