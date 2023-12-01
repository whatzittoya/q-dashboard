<script setup>
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue'
import TransactionTable from '@/components/quinos/transaction/TransactionTable.vue'
import SearchBox from '@/components/quinos/transaction/SearchBox.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import CardBox from '@/components/CardBox.vue'
import { mdiCurrencyUsd } from '@mdi/js'
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiCurrencyUsd" title="Transaction" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <SearchBox></SearchBox>
        <TransactionTable></TransactionTable>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script>
export default {}
</script>

<style></style>
