<script setup>
import { computed, ref } from 'vue'
import { useMainStore } from '@/stores/main'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import TableLoading from '@/components/quinos/skeleton/TableLoading.vue'
import CardBox from '@/components/CardBox.vue'
import { mdiEye, mdiTrashCan } from '@mdi/js'
import { autoFormat } from '@/service/formatNumber'

const props = defineProps({
  items: { type: Object, default: () => ({}) },
  dataAttr: { type: Object, default: () => ({}) },
  id: { type: String, default: '' },
  hasEdit: { type: Boolean, default: true },
  hasPaging: { type: Boolean, default: true },
  hasHeader: { type: Boolean, default: true },
  rowLoading: { type: Number, default: 20 }
})

const emit = defineEmits(['open-info-modal', 'open-danger-modal'])
//const items = computed(() => mainStore.clients)
const items = computed(() => {
  //mainStore.fetchQuinosTransactionMonthly('BAKED_BERAWA')
  return props.items
})

const perPage = ref(20)

const currentPage = ref(0)

const itemsPaginated = computed(() => {
  if (!props.hasPaging) {
    return items.value?.data
  }
  const i = items.value?.data?.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
  return i ? i : []
})

const numPages = computed(() => Math.ceil(items.value?.data?.length / perPage.value))

const currentPageHuman = computed(() => currentPage.value + 1)
const openInfoModal = (data) => {
  emit('open-info-modal', true, data)
}

const openDangerModal = (data) => {
  emit('open-danger-modal', true, data)
}

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
        <th  v-for="d in props.dataAttr" v-show="props.hasHeader" :key="d.label">{{ d.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="data in itemsPaginated" :key="data.id">
        <td v-for="d in props.dataAttr" :key="d.obj" :data-label="d.obj">
          {{ autoFormat(data[d.obj],d.format)}}
        </td>
      <td v-show="props.hasEdit" class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton color="info" :icon="mdiEye" small @click="openInfoModal(data)" />
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="openDangerModal(data)"
            />
          </BaseButtons>
        </td>
      </tr>
      <TableLoading v-if="items.isLoading" :num-col="props.dataAttr.length" :row="props.rowLoading"></TableLoading>

    </tbody>
  </table>
  <div v-show="props.hasPaging" class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
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
