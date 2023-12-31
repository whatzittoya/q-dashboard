<script setup>
import { mdiViewDashboard } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { useMainStore } from '@/stores/main'
import { computed, onMounted, ref } from 'vue'
import SummarySalesCard from '@/components/quinos/sales/SummarySalesCard.vue'
import SalesDepartmentCard from '@/components/quinos/sales/SalesDepartmentCard.vue'
import SalesCategoryCard from '@/components/quinos/sales/SalesCategoryCard.vue'
import PaymentSummaryCard from '@/components/quinos/sales/PaymentSummaryCard.vue'
import DiscountSummaryCard from '@/components/quinos/sales/DiscountSummaryCard.vue'
import StatisticCard from '@/components/quinos/sales/StatisticCard.vue'
import SearchBox from '@/components/quinos/form/SearchBox.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'

const mainStore = useMainStore()
const SummmarySalesRef = ref(null)
const SalesDepartmentRef = ref(null)
const PaymentSummaryRef = ref(null)
const firsLoad = ref(false)

const summarySales = computed(() => {
  if (!mainStore.apiData.summary_sales.isLoading) {
    try {
      return { isLoading: false, data: mainStore.apiData.summary_sales.data[0].Transaction }
    } catch {
      return { isLoading: false, data: [{ Transaction: {} }] }
    }
  }
  return mainStore.apiData.summary_sales
})

const itemSales = computed(() => {
  if (!mainStore.apiData.item_sales.isLoading) {
    try {
      return {
        isLoading: false,
        data: mainStore.apiData.item_sales.data
      }
    } catch {
      return { isLoading: false, data: [] }
    }
  }
  return mainStore.apiData.item_sales
})

const itemPayment = computed(() => {
  if (!mainStore.apiData.payment_summary.isLoading) {
    try {
      return {
        isLoading: false,
        data: mainStore.apiData.payment_summary.data
      }
    } catch {
      return { isLoading: false, data: [] }
    }
  }
  return mainStore.apiData.item_sales
})

const ItemDiscount = computed(() => {
  if (!mainStore.apiData.discount_summary.isLoading) {
    try {
      return { isLoading: false, data: mainStore.apiData.discount_summary.data }
    } catch {
      return { isLoading: false, data: [] }
    }
  }
  return mainStore.apiData.discount_summary
})

const itemStatistic = computed(() => {
  const grand_total = parseFloat(SummmarySalesRef.value?.itemSummary.data.grand_total)
  const num_transaction = summarySales.value?.data?.quantity
  const avg_transaction = grand_total / num_transaction
  const total_guest = summarySales.value?.data.pax
  const avg_pax = grand_total / total_guest
  const average_net_pax = (grand_total - summarySales.value?.data?.discount) / total_guest
  console.log(
    PaymentSummaryRef.value?.itemPayment.data.filter((i) => i.paymentCode == 'Total')[0]
      ?.totalQuantity
  )
  return {
    isLoading: false,
    data: {
      grand_total,
      num_transaction,
      avg_transaction,
      total_guest,
      avg_pax,
      average_net_pax
    }
  }
})

const getReport = (date1, date2, store) => {
  firsLoad.value = true
  mainStore.fetchSummarySales(date1, date2, store)
  mainStore.fetchItemSales(date1, date2, store)
  mainStore.fetchPaymentSummary(date1, date2, store)
  mainStore.fetchDiscountSummary(date1, date2, store)
}
onMounted(() => {
  mainStore.clearApiData('summary_sales')
  mainStore.clearApiData('item_sales')
  mainStore.clearApiData('payment_summary')
  mainStore.clearApiData('discount_summary')
})
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiViewDashboard" title="Summary Sales Report" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <div class="p-2">
          <SearchBox :has-date="true" @search-data="getReport"></SearchBox>
        </div>
        <SectionMain v-if="firsLoad" class="flex flex-col lg:flex-row">
          <div class="flex flex-col w-full">
            <SummarySalesCard ref="SummmarySalesRef" :items="summarySales"></SummarySalesCard>
            <StatisticCard :items="itemStatistic"></StatisticCard>
          </div>
          <div class="flex flex-col w-full">
            <SalesCategoryCard :items="itemSales"></SalesCategoryCard>
            <DiscountSummaryCard :items="ItemDiscount"></DiscountSummaryCard>
          </div>
          <div class="flex flex-col w-full">
            <PaymentSummaryCard ref="PaymentSummaryRef" :items="itemPayment"></PaymentSummaryCard>
            <SalesDepartmentCard ref="SalesDepartmentRef" :items="itemSales"></SalesDepartmentCard>
          </div>
        </SectionMain>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
