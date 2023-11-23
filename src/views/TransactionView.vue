<script setup>
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue'
import TransactionTable from '@/components/quinos/transaction/TransactionTable.vue'
import SearchBox from '@/components/quinos/transaction/SearchBox.vue'
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SearchBox></SearchBox>
        <TransactionTable></TransactionTable>
        </SectionMain>
        </LayoutAuthenticated>
</template>

<script>
export default {}
</script>

<style>
</style>