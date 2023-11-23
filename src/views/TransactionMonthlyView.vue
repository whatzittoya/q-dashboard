<script setup>
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue'
import TransactionMonthly from '@/components/quinos/transaction/TransactionMonthly.vue'
import SearchBox from '@/components/quinos/transaction/SearchBox.vue'
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SearchBox transaction="monthly"></SearchBox>
        <TransactionMonthly></TransactionMonthly>
        </SectionMain>
        </LayoutAuthenticated>
</template>

<script>
export default {}
</script>

<style>
</style>