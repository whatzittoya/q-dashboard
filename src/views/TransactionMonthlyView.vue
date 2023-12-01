<script setup>
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue'
import TransactionMonthly from '@/components/quinos/transaction/TransactionMonthly.vue'
import SearchBox from '@/components/quinos/transaction/SearchBox.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import CardBox from '@/components/CardBox.vue'
import { mdiTimeline } from '@mdi/js'
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTimeline" title="Transaction" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <SearchBox transaction="monthly"></SearchBox>
        <TransactionMonthly></TransactionMonthly>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script>
export default {}
</script>

<style></style>
