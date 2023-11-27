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
import ItemSalesTable from '@/components/quinos/itemsales/ItemSalesTable.vue'

const mainStore = useMainStore()
const labels = [1, 2, 3, 4, 5, 6, 7]

const getReport = (date1, date2, store) => {
  mainStore.fetchItemSales(date1, date2, store)
}
const ItemSales = computed(() => {
  if (!mainStore.apiData.item_sales.isLoading) {
    try {
      return { isLoading: false, data: mainStore.apiData.item_sales.data }
    } catch {
      return { isLoading: false, data: [] }
    }
  }
  return mainStore.apiData.item_sales
})
onMounted(() => {
  mainStore.clearApiData('item_sales')
})
</script>

<template>
     <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiChartBar" title="Item Sales Report" main>
 </SectionTitleLineWithButton>
 <CardBox>
    <SearchBox has-date  @search-data="getReport"></SearchBox>
    <BarChart :items="ItemSales"> </BarChart>
    <ItemSalesTable :items="ItemSales"></ItemSalesTable>
</CardBox>
 </SectionMain>
 </LayoutAuthenticated>
</template>