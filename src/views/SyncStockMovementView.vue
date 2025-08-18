<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import CardBox from "@/components/CardBox.vue";
import { mdiSync } from "@mdi/js";
import { computed, onMounted, ref } from "vue";
import { useMainStore } from "@/stores/main";

import BaseButton from "@/components/BaseButton.vue";
import axios from "axios";

const mainStore = useMainStore();
const isLoading = ref(false);
const refreshFromCloud = ref(false);

const showSyncModal = ref(false);
const currentProgress = ref(0);
const totalDays = ref(0);
const currentDate = ref("");
const syncLogs = ref([]);
const canCancel = ref(true);
const startDate = ref("");
const endDate = ref("");
const today = ref("");

const availableDates = computed(() => {
  return mainStore.apiData.available_dates.data?.data || [];
});

const syncedData = computed(() => {
  // Generate all months from June onwards
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const groupedData = {};

  // Generate months from June of current year to current month
  for (let year = currentYear; year >= 2025; year--) {
    const startMonth = year === currentYear ? Math.max(6, currentMonth) : 12;
    const endMonth = year === 2025 ? 6 : 1;

    for (let month = startMonth; month >= endMonth; month--) {
      const key = `${year}-${month.toString().padStart(2, "0")}`;
      const date = new Date(year, month - 1, 1); // month - 1 because getMonth() returns 0-11

      groupedData[key] = {
        year: year,
        month: month,
        monthName: date.toLocaleDateString("en-US", { month: "long" }),
        dates: new Array(31).fill(false), // Initialize all days as false
      };
    }
  }

  // Mark synced dates if available
  if (availableDates.value.available_dates) {
    availableDates.value.available_dates.forEach((dateStr) => {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      // Only process dates from June onwards
      if (month < 6) return;

      const key = `${year}-${month.toString().padStart(2, "0")}`;

      if (groupedData[key]) {
        // Mark this day as synced (true)
        groupedData[key].dates[day - 1] = true; // Array is 0-indexed, so day-1
      }
    });
  }

  // Convert to array and sort by year/month
  return Object.values(groupedData).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year; // Newest year first
    return b.month - a.month; // Newest month first
  });
});

onMounted(() => {
  if (availableDates.value.length === 0) {
    mainStore.fetchAvailableDates();
  }

  const todayDate = new Date();
  today.value = todayDate.toISOString().split("T")[0];

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(todayDate.getDate() - 30);
  startDate.value = thirtyDaysAgo.toISOString().split("T")[0];
  endDate.value = today.value;

  mainStore.fetchAvailableDates();
});

const openSyncModal = () => {
  if (!startDate.value || !endDate.value) {
    alert("Please select a date range");
    return;
  }

  showSyncModal.value = true;
  currentProgress.value = 0;
  syncLogs.value = [];
  canCancel.value = true;

  // Calculate total days
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  totalDays.value = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  startSync();
};

const closeSyncModal = () => {
  showSyncModal.value = false;
};

const cancelSync = () => {
  canCancel.value = false;
  addSyncLog("Sync cancelled by user", "info");
  setTimeout(() => {
    closeSyncModal();
  }, 1000);
};

const addSyncLog = (message, type = "info") => {
  syncLogs.value.unshift({
    message: `${new Date().toLocaleTimeString()}: ${message}`,
    type,
  });

  // Keep only last 10 logs
  if (syncLogs.value.length > 10) {
    syncLogs.value = syncLogs.value.slice(0, 10);
  }
};

const startSync = async () => {
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  addSyncLog(`Starting sync from ${startDate.value} to ${endDate.value}`, "info");

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (!canCancel.value) break;

    const dateStr = d.toISOString().split("T")[0];
    currentDate.value = dateStr;
    currentProgress.value++;

    try {
      addSyncLog(`Syncing ${dateStr}...`, "info");

      // Call the sync API for this specific date
      let apiUrl = `${
        import.meta.env.VITE_API_URL
      }/stock-level/sync-movement-date/${dateStr}`;
      if (refreshFromCloud.value) {
        apiUrl += `?refresh=true`;
      }

      await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      addSyncLog(`Successfully synced ${dateStr}`, "success");

      // Small delay to show progress
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      addSyncLog(
        `Failed to sync ${dateStr}: ${error.response?.data?.message || error.message}`,
        "error"
      );
    }
  }

  if (canCancel.value) {
    addSyncLog("Sync completed successfully", "success");
    setTimeout(() => {
      closeSyncModal();
      mainStore.fetchAvailableDates(); // Refresh the data
    }, 2000);
  }
};

const selectDate = (dateStr) => {
  // Set the date range to just this date
  startDate.value = dateStr;
  endDate.value = dateStr;
};

const getDateCellClass = (year, month, day, isSynced) => {
  const dateStr = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
  const isSelected = startDate.value === dateStr || endDate.value === dateStr;

  if (isSelected) {
    return "bg-blue-500 text-white";
  }

  if (isSynced) {
    return "bg-green-500 text-white hover:bg-green-600";
  }

  return "bg-gray-200 text-gray-700 hover:bg-gray-300";
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

const getEmptyDaysBeforeMonth = (year, month) => {
  const firstDay = new Date(year, month - 1, 1).getDay();
  return firstDay;
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiSync" title="Sync Stock Movement" main>
      </SectionTitleLineWithButton>
      <!-- Date Range Picker -->
      <CardBox class="mb-6">
        <div class="flex flex-col md:flex-row gap-4 items-center">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700">Date Range:</label>
            <input
              v-model="startDate"
              type="date"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :max="endDate"
            />
            <span class="text-gray-500">to</span>
            <input
              v-model="endDate"
              type="date"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :min="startDate"
              :max="today"
            />
          </div>

          <!-- Refresh from Quinos Cloud checkbox -->
          <div class="flex items-center gap-2">
            <input
              id="refresh-cloud-sync"
              v-model="refreshFromCloud"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="refresh-cloud-sync" class="text-sm text-gray-700">
              Re-sync from Quinos Cloud
            </label>
          </div>

          <BaseButton
            :icon="mdiSync"
            label="Sync Selected Range"
            color="success"
            :loading="isLoading"
            :disabled="!startDate || !endDate"
            @click="openSyncModal"
          />
        </div>
      </CardBox>

      <!-- Calendar View -->
      <div class="grid gap-6">
        <div
          v-for="monthData in syncedData"
          :key="`${monthData.year}-${monthData.month}`"
          class="bg-white rounded-lg shadow p-6"
        >
          <h3 class="text-lg font-semibold mb-4">
            {{ monthData.monthName }} {{ monthData.year }}
          </h3>
          <div class="grid grid-cols-7 gap-1">
            <!-- Day headers -->
            <div
              v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
              :key="day"
              class="text-center text-sm font-medium text-gray-500 p-2"
            >
              {{ day }}
            </div>

            <!-- Empty cells for days before the first day of the month -->
            <div
              v-for="emptyDay in getEmptyDaysBeforeMonth(monthData.year, monthData.month)"
              :key="`empty-${emptyDay}`"
              class="p-2"
            ></div>

            <!-- Date cells -->
            <div
              v-for="day in getDaysInMonth(monthData.year, monthData.month)"
              :key="`${monthData.year}-${monthData.month}-${day}`"
              class="relative"
            >
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer transition-colors"
                :class="
                  getDateCellClass(
                    monthData.year,
                    monthData.month,
                    day,
                    monthData.dates[day - 1]
                  )
                "
                @click="
                  selectDate(
                    `${monthData.year}-${monthData.month
                      .toString()
                      .padStart(2, '0')}-${day.toString().padStart(2, '0')}`
                  )
                "
              >
                {{ day }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sync Progress Modal -->
      <div
        v-if="showSyncModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Syncing Stock Movement Data</h3>
            <button class="text-gray-400 hover:text-gray-600" @click="closeSyncModal">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div class="mb-4">
            <div class="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress: {{ currentProgress }}/{{ totalDays }}</span>
              <span>{{ Math.round((currentProgress / totalDays) * 100) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${(currentProgress / totalDays) * 100}%` }"
              ></div>
            </div>
          </div>

          <div class="mb-4">
            <div class="text-sm text-gray-600 mb-2">Current Date:</div>
            <div class="text-lg font-medium">{{ currentDate }}</div>
          </div>

          <div class="mb-4 max-h-32 overflow-y-auto">
            <div class="text-sm text-gray-600 mb-2">Recent Activity:</div>
            <div v-for="(log, index) in syncLogs" :key="index" class="text-sm py-1">
              <span
                :class="
                  log.type === 'success'
                    ? 'text-green-600'
                    : log.type === 'error'
                    ? 'text-red-600'
                    : 'text-blue-600'
                "
              >
                {{ log.message }}
              </span>
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <BaseButton
              label="Cancel"
              color="danger"
              :disabled="!canCancel"
              @click="cancelSync"
            />
          </div>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
