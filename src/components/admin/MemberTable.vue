<script setup>
import { computed } from 'vue'
import { useMainStore } from '@/stores/main'

import GenericTable from '@/components/Table/GenericTable.vue'
defineProps({
  checkable: Boolean
})

const mainStore = useMainStore()
mainStore.fetchMember()
const items = computed(() => {
  return mainStore.apiData.member
})

const data_attr = [
  {
    label: 'Name',
    obj: 'name'
  },
  {
    label: 'Email',
    obj: 'email'
  },
  {
    label: 'Role',
    obj: 'role'
  },
  {
    label: 'Location',
    obj: 'location'
  }
]
</script>

<template>
  <GenericTable :items="items" :data-attr="data_attr"></GenericTable>

</template>
