<script setup>
import { ref, computed, onMounted } from "vue";
import VueTailwindDatepicker from "vue-tailwind-datepicker";
import { useMainStore } from "@/stores/main";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";

const props = defineProps({
  transaction: {
    type: String,
    default: "daily",
    validator: (value) => ["daily", "monthly"].includes(value),
  },
});
const dateValue = ref([]);
const mainStore = useMainStore();
const formatter = ref({
  date: "YYYY-MM-DD",
  month: "MMM",
});
const selectOptions = computed(() => {
  const st = mainStore.apiData.store.data.map((item) => {
    return {
      label: item.long_name,
      value: item.name,
    };
  });
  return st;
});
const store = ref(selectOptions.value[0]);

const searchData = () => {
  // console.log(props.transaction);
  if (props.transaction == "daily") {
    mainStore.fetchQuinosTransaction(
      dateValue.value[0],
      dateValue.value[1],
      store.value.value
    );
  } else if (props.transaction == "monthly") {
    mainStore.fetchQuinosTransactionMonthly(store.value.value);
  }
};
onMounted(() => {
  if (mainStore.apiData.store.data.length == 0) {
    mainStore.fetchQuinosStore();
  }
});
</script>

<template>
  <div class="flex flex-col sm:flex-row">
    <div v-if="props.transaction == 'daily'" class="w-full m-3 p-3">
      <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="grid-first-name"
      >
        Date Range
      </label>
      <vue-tailwind-datepicker v-model="dateValue" :formatter="formatter" />
    </div>
    <div class="w-full m-3 p-3">
      <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="grid-first-name"
      >
        Store
      </label>
      <FormControl v-model="store" :options="selectOptions" />
    </div>
    <div class="w-full m-8 p-3">
      <BaseButton type="submit" color="info" label="Submit" @click="searchData()" />
    </div>
  </div>
</template>
