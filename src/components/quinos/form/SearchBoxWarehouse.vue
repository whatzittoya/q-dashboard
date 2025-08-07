<script setup>
import { ref, computed, onMounted, watch } from "vue";
import VueTailwindDatepicker from "vue-tailwind-datepicker";
import { useMainStore } from "@/stores/main";
import BaseButton from "@/components/BaseButton.vue";

const props = defineProps({
  hasDate: { type: Boolean, default: true },
  hasMonth: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
});
const emit = defineEmits(["search-data"]);

const dateValue = ref([]);
const showInfoBox = ref(false);
const infoMessage = ref("");

const mainStore = useMainStore();
const formatter = ref({
  date: "YYYY-MM-DD",
  month: "MMM",
});

const availableDates = computed(() => {
  const dates = mainStore.apiData.available_dates.data?.data?.available_dates || [];
  // Convert ISO dates to YYYY-M-D format for comparison
  return dates.map((date) => {
    if (typeof date === "string" && date.includes("T")) {
      return date.split("T")[0]; // Extract YYYY-MM-DD part
    }
    return date;
  });
});

// Watch for date changes and validate immediately
const validateDate = (newDate) => {
  console.log("Selected date:", newDate);
  console.log("Available dates:", availableDates.value);

  if (
    newDate &&
    availableDates.value.length > 0 &&
    !availableDates.value.includes(newDate)
  ) {
    showInfoBox.value = true;
    infoMessage.value =
      "The data for this date has not been synced yet. It might take some time to load. Please try a different date or contact support if the issue persists.";
  } else {
    showInfoBox.value = false;
  }
};

// Watch for date changes
watch(dateValue, (newValue) => {
  if (newValue && newValue.length > 0) {
    validateDate(newValue[0]);
  } else {
    showInfoBox.value = false;
  }
});

const searchData = () => {
  const selectedDate = dateValue.value[0];

  // Always emit search data, regardless of validation status
  emit("search-data", selectedDate);
};

const isDateSelected = computed(() => {
  return dateValue.value && dateValue.value.length > 0;
});

const closeInfoBox = () => {
  showInfoBox.value = false;
};

onMounted(() => {
  // Load available dates when component mounts
  mainStore.fetchAvailableDates();
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
        class="w-full"
        as-single=""
      />

      <!-- Info Box for unavailable data - moved below date picker -->
      <div
        v-if="showInfoBox"
        class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm text-blue-700">{{ infoMessage }}</p>
          </div>
          <div class="ml-auto pl-3">
            <button
              class="inline-flex text-blue-400 hover:text-blue-600"
              @click="closeInfoBox"
            >
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full m-8 p-3">
      <BaseButton
        type="submit"
        color="info"
        label="Submit"
        :disabled="!isDateSelected || props.loading"
        @click="searchData()"
      />
    </div>
  </div>
</template>
