<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import CardBox from "@/components/CardBox.vue";
import { mdiNumeric0Box, mdiSync } from "@mdi/js";
import { computed, onMounted, ref } from "vue";
import { useMainStore } from "@/stores/main";
import BaseIcon from "@/components/BaseIcon.vue";

const mainStore = useMainStore();
const isSyncing = ref(false);

const warehouses = computed(() => {
  return mainStore.apiData.warehouse.data || [];
});

const stockLevelData = computed(() => {
  return mainStore.apiData.stock_minimum.data.data || [];
});

const isLoading = computed(() => {
  return mainStore.apiData.stock_minimum.isLoading;
});

// Extract warehouse names from the first item's properties
const arrayWarehouse = computed(() => {
  if (stockLevelData.value.length > 0) {
    const firstItem = stockLevelData.value[0];
    return Object.keys(firstItem).filter((key) => !["name", "item_id"].includes(key));
  }
  return [];
});

const syncStockLevels = async () => {
  isSyncing.value = true;
  try {
    await mainStore.syncStockLevels("all");
    // Refresh the stock level data after sync
    await mainStore.fetchStockLevels();
  } finally {
    isSyncing.value = false;
  }
};

const fetchStockLevels = async () => {
  await mainStore.fetchStockLevels();
};

onMounted(() => {
  if (warehouses.value.length === 0) {
    mainStore.fetchWarehouse();
  }
  // Load stock levels for all warehouses
  fetchStockLevels();
});
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiNumeric0Box" title="Stock Level" main>
        <button
          :disabled="isSyncing"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200"
          @click="syncStockLevels"
        >
          <BaseIcon
            :path="mdiSync"
            :class="{ 'animate-spin': isSyncing }"
            class="mr-2"
            size="18"
          />
          {{ isSyncing ? "Syncing..." : "Sync Stock Levels" }}
        </button>
      </SectionTitleLineWithButton>

      <CardBox>
        <div class="relative">
          <!-- Loading Overlay -->
          <div
            v-if="isLoading"
            class="absolute inset-0 bg-white/30 z-50 flex items-start justify-center pt-6"
          >
            <div class="bg-white/90 px-4 py-2 rounded-lg shadow-lg border">
              <div class="flex items-center space-x-2">
                <div
                  class="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"
                ></div>
                <div class="text-sm font-medium text-gray-700">
                  Loading stock levels...
                </div>
              </div>
            </div>
          </div>

          <!-- Stock Level Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                  >
                    Item ID
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                  >
                    Item Name
                  </th>
                  <th
                    v-for="warehouse in arrayWarehouse"
                    :key="warehouse"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                  >
                    {{ warehouse }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="item in stockLevelData"
                  :key="item.item_id"
                  class="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-b"
                  >
                    {{ item.item_id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                    {{ item.name }}
                  </td>
                  <td
                    v-for="warehouse in arrayWarehouse"
                    :key="warehouse"
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b"
                  >
                    <div class="flex flex-col space-y-1">
                      <div class="flex items-center space-x-2">
                        <span class="text-xs text-gray-500">Min:</span>
                        <span
                          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800"
                        >
                          {{ item[warehouse]?.minimum || 0 }}
                        </span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-xs text-gray-500">Max:</span>
                        <span
                          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                        >
                          {{ item[warehouse]?.maximum || 0 }}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- Empty state -->
                <tr v-if="!isLoading && stockLevelData.length === 0">
                  <td :colspan="2 + arrayWarehouse.length" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center">
                      <svg
                        class="h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                      <h3 class="mt-2 text-sm font-medium text-gray-900">
                        No stock levels found
                      </h3>
                      <p class="mt-1 text-sm text-gray-500">
                        Sync stock levels to see data for all warehouses.
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Summary -->
          <div
            v-if="stockLevelData.length > 0"
            class="mt-6 bg-gray-50 px-4 py-3 rounded-lg"
          >
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Total items:
                <span class="font-semibold">{{ stockLevelData.length }}</span>
              </div>
              <div class="text-sm text-gray-500">
                Warehouses: <span class="font-semibold">{{ arrayWarehouse.length }}</span>
              </div>
              <div class="text-sm text-gray-500">
                Last updated: {{ new Date().toLocaleDateString() }}
              </div>
            </div>
          </div>
        </div>
      </CardBox>
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
