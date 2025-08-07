<script setup>
import { ref, computed, onMounted } from "vue";
import VueTailwindDatepicker from "vue-tailwind-datepicker";
import { useMainStore } from "@/stores/main";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";

const props = defineProps({
  isSingleDate: { type: Boolean, default: false },
  hasDate: { type: Boolean, default: true },
  hasMonth: { type: Boolean, default: false },
});
const emit = defineEmits(["search-data"]);

const dateValue = ref([]);
const dateMonth = ref({
  label: new Date().toLocaleString("default", { month: "long" }),
  value: new Date().getMonth() + 1,
});
const dateYear = ref(new Date().getFullYear());
const yearOptions = [];
const startYear = 2024;
const currentYear = new Date().getFullYear();
for (let i = 0; i <= currentYear - startYear; i++) {
  yearOptions.push(startYear + i);
}
const monthOptions = ref([
  {
    label: "January",
    value: 1,
  },
  {
    label: "February",
    value: 2,
  },
  {
    label: "March",
    value: 3,
  },
  {
    label: "April",
    value: 4,
  },
  {
    label: "May",
    value: 5,
  },
  {
    label: "June",
    value: 6,
  },
  {
    label: "July",
    value: 7,
  },
  {
    label: "August",
    value: 8,
  },
  {
    label: "September",
    value: 9,
  },
  {
    label: "October",
    value: 10,
  },
  {
    label: "November",
    value: 11,
  },
  {
    label: "December",
    value: 12,
  },
]);
const mainStore = useMainStore();
const formatter = ref({
  date: "YYYY-MM-DD",
  month: "MMM",
});

// console.log(props.hasDate);
const isLoading = computed(() => {
  const st = mainStore.apiData.store.isLoading;
  return st;
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
  if (props.hasDate) {
    emit("search-data", dateValue.value[0], dateValue.value[1], store.value.value);
  } else if (props.hasMonth) {
    emit("search-data", dateMonth.value.value, dateYear.value, store.value.value);
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
    <div v-if="props.hasDate" class="w-full m-3 p-3">
      <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="grid-first-name"
      >
        Date Range
      </label>

      <vue-tailwind-datepicker
        v-if="props.hasDate"
        v-model="dateValue"
        :formatter="formatter"
        class="w-"
      />
    </div>
    <div v-if="props.hasMonth" class="w-full m-3 p-3">
      <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="grid-first-name"
      >
        Month
      </label>
      <FormControl v-model="dateMonth" :options="monthOptions" />
    </div>
    <div v-if="props.hasMonth" class="w-full m-3 p-3">
      <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="grid-first-name"
      >
        Year
      </label>
      <FormControl v-model="dateYear" :options="yearOptions" />
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
      <BaseButton
        type="submit"
        color="info"
        label="Submit"
        :disabled="isLoading"
        @click="searchData()"
      />
    </div>
  </div>
</template>
