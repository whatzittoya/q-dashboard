<script setup>
import { ref, computed } from 'vue'
import VueTailwindDatepicker from 'vue-tailwind-datepicker'
import { useMainStore } from '@/stores/main'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps({
  transaction: {
    type: String,
    default: 'daily',
    validator: (value) => ['daily', 'monthly'].includes(value)
  }
})
const dateValue = ref([])
const mainStore = useMainStore()
const formatter = ref({
  date: 'YYYY-MM-DD',
  month: 'MMM'
})
if (mainStore.apiData.store.data.length == 0) {
  mainStore.fetchQuinosStore()
}

const selectOptions = computed(() => {
  const st = ['All'].concat(mainStore.apiData.store.data)
  return st
})
const store = ref(selectOptions.value[0])
const searchData = () => {
  console.log(props.transaction)
  if (props.transaction == 'daily') {
    mainStore.fetchQuinosTransaction(dateValue.value[0], dateValue.value[1], store.value)
  } else if (props.transaction == 'monthly') {
    mainStore.fetchQuinosTransactionMonthly(store.value)
  }
}
</script>

<template>
<FormField label="Dropdown">
    <vue-tailwind-datepicker v-if="props.transaction == 'daily'" v-model="dateValue" :formatter="formatter" />
    <FormControl v-model="store" :options="selectOptions" />
</FormField>
<FormField>
    <BaseButton type="submit" color="info" label="Submit" @click="searchData()" />
</FormField>
</template>
