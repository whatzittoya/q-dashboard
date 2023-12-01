<script setup>
import { computed, ref } from 'vue'
import { useMainStore } from '@/stores/main'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import TableLoading from '@/components/quinos/skeleton/TableLoading.vue'
import CardBox from '@/components/CardBox.vue'
import { autoFormat } from '@/service/formatNumber'

const props = defineProps({
  items: { type: Object, default: () => ({}) },
  dataAttr: { type: Object, default: () => ({}) },
  id: { type: String, default: '' }
})

//const items = computed(() => mainStore.clients)
const items = computed(() => {
  //mainStore.fetchQuinosTransactionMonthly('BAKED_BERAWA')
  return props.items
})

const perPage = ref(20)

const currentPage = ref(0)

const itemsPaginated = computed(() => {
  const i = items.value?.data?.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
  return i ? i : []
})

const numPages = computed(() => Math.ceil(items.value?.data?.length / perPage.value))

const currentPageHuman = computed(() => currentPage.value + 1)

const pagesList = computed(() => {
  const pagesList = []

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})
</script>
<template>
  <CardBox class="mb-6" has-table>
    <table>
      <thead>
        <tr>
          <th v-for="d in props.dataAttr" :key="d.label">{{ d.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in itemsPaginated" :key="data.Transaction.id">
          <td v-for="d in props.dataAttr" :key="d.obj" :data-label="d.obj">
            {{ autoFormat(data.Transaction[d.obj], d.format) }}
          </td>
        </tr>
        <TableLoading v-if="items.isLoading" :num-col="props.dataAttr.length"></TableLoading>
      </tbody>
    </table>
    <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
      <BaseLevel>
        <BaseButtons>
          <BaseButton
            v-for="page in pagesList"
            :key="page"
            :active="page === currentPage"
            :label="page + 1"
            :color="page === currentPage ? 'lightDark' : 'whiteDark'"
            small
            @click="currentPage = page"
          />
        </BaseButtons>
        <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
      </BaseLevel>
    </div>
  </CardBox>
</template>
