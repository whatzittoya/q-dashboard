<script setup>
import { mdiChartBar } from '@mdi/js'
import { ref, watch, computed, onMounted } from 'vue'
import CardBox from '@/components/CardBox.vue'
import SearchBox from '@/components/quinos/form/SearchBox.vue'

import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import { useMainStore } from '@/stores/main'
import BarChart from '@/components/quinos/itemsales/BarChart.vue'
import SalesTypeTable from '@/components/quinos/salestype/SalesTypeTable.vue'

const mainStore = useMainStore()

const getReport = (date1, date2, store) => {
  mainStore.fetchSalesType(date1, date2, store)
}
const ItemSales = computed(() => {
  if (!mainStore.apiData.sales_type.isLoading) {
    try {
      return { isLoading: false, data: mainStore.apiData.sales_type.data }
    } catch {
      return { isLoading: false, data: [] }
    }
  }
  return mainStore.apiData.item_sales
})
onMounted(() => {
  mainStore.clearApiData('sales_type')
})
</script>

<template>
     <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiChartBar" title="Sales Type Report" main>
 </SectionTitleLineWithButton>
 <CardBox>
    <SearchBox has-date  @search-data="getReport"></SearchBox>
    <SalesTypeTable :items="ItemSales"></SalesTypeTable>
</CardBox>
 </SectionMain>
 </LayoutAuthenticated>
</template>