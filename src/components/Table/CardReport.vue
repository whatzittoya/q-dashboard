<script setup>
import CardBox from '@/components/CardBox.vue'
import NotificationBarInCard from '@/components/NotificationBarInCard.vue'
import { autoFormat } from '@/service/formatNumber'
import { computed } from 'vue'
import GenericTable from '@/components/Table/GenericTable.vue'

const props = defineProps({
  title: { type: String, default: '' },
  items: { type: Object, default: () => ({}) },
  dataList: { type: Object, default: () => ({}) }
})

const column = [
  { label: 'label', obj: 'label' },
  { label: 'obj', obj: 'obj' }
]

function getLabelByObj(filterObj) {
  const result = props.dataList.find((item) => item.obj === filterObj)

  return result ? result : null
}

const listItems = computed(() => {
  if (!props.items.isLoading) {
    const newArray = Object.entries(props.items.data)
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
    return { isLoading: false, data: newArray }
  }
  return props.items
})
</script>

<template>


      <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/3 p-2">
      <CardBox >
         <NotificationBarInCard
          color="info"
          :is-placed-with-header="true"
        >
          <h1>{{title}}</h1>
        </NotificationBarInCard>
        <GenericTable :items="listItems" :data-attr="column" :has-edit="false" :has-paging="false" :has-header="false"></GenericTable>
   

      </CardBox>
      </div>
 

</template>
