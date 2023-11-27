<script setup>
import CardBox from '@/components/CardBox.vue'
import NotificationBarInCard from '@/components/NotificationBarInCard.vue'
import { autoFormat } from '@/service/formatNumber'
import { computed } from 'vue'
import GenericTable from '@/components/Table/GenericTable.vue'

const props = defineProps({
  title: { type: String, default: '' },
  items: { type: Object, default: () => ({}) },
  dataList: { type: Object, default: () => ({}) },
  transformed: { type: Boolean, default: false }
})

const columnDefault = [
  { label: 'label', obj: 'label' },
  { label: 'obj', obj: 'obj' }
]
const column = computed(() => {
  return props.transformed ? columnDefault : props.dataList
})

function getLabelByObj(filterObj) {
  const result = props.dataList.find((item) => item.obj === filterObj)

  return result ? result : null
}

const transformData = (data) => {
  return Object.entries(data)
    .map(([label, val]) => {
      if (getLabelByObj(label) !== null) {
        const labelByObj = getLabelByObj(label)
        return {
          label: labelByObj.label,
          obj: autoFormat(val, labelByObj.type) // Convert the value to an integer
        }
      }
    })
    .filter(Boolean)
}

const listItems = computed(() => {
  if (!props.items.isLoading) {
    const data = props.transformed ? transformData(props.items?.data) : props.items?.data
    return { isLoading: false, data: data }
  }
  return props.items
})
</script>

<template>
    <div class="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/3 p-2">
    <CardBox >
        <NotificationBarInCard
        color="info"
        :is-placed-with-header="true"
    >
        <h1>{{title}}</h1>
    </NotificationBarInCard>
    <GenericTable :items="listItems" :data-attr="column" :has-edit="false" :has-paging="false" :has-header="false" :row-loading="5"></GenericTable>


    </CardBox>
    </div>
</template>
