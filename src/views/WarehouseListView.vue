<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import CardBox from "@/components/CardBox.vue";
import { mdiWarehouse, mdiSync } from "@mdi/js";
import { computed, onMounted, ref } from "vue";
import { useMainStore } from "@/stores/main";
import BaseIcon from "@/components/BaseIcon.vue";

const mainStore = useMainStore();
const isSyncing = ref(false);

const warehouses = computed(() => {
  return mainStore.apiData.warehouse.data || [];
});

const isLoading = computed(() => {
  return mainStore.apiData.warehouse.isLoading;
});

const syncWarehouses = async () => {
  isSyncing.value = true;
  try {
    await mainStore.syncWarehouses();
    // Refresh the warehouse list after sync
    await mainStore.fetchWarehouse();
  } finally {
    isSyncing.value = false;
  }
};

onMounted(() => {
  if (warehouses.value.length === 0) {
    mainStore.fetchWarehouse();
  }
});
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiWarehouse" title="Warehouse List" main>
        <button
          :disabled="isSyncing"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200"
          @click="syncWarehouses"
        >
          <BaseIcon
            :path="mdiSync"
            :class="{ 'animate-spin': isSyncing }"
            class="mr-2"
            size="18"
          />
          {{ isSyncing ? "Syncing..." : "Sync Warehouses" }}
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
                <div class="text-sm font-medium text-gray-700">Loading warehouses...</div>
              </div>
            </div>
          </div>

          <!-- Warehouse Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                  >
                    Warehouse ID
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                  >
                    Warehouse Name
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="warehouse in warehouses"
                  :key="warehouse.id"
                  class="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-b"
                  >
                    {{ warehouse.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-8 w-8">
                        <div
                          class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center"
                        >
                          <svg
                            class="h-4 w-4 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ warehouse.name }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      Active
                    </span>
                  </td>
                </tr>

                <!-- Empty state -->
                <tr v-if="!isLoading && warehouses.length === 0">
                  <td colspan="3" class="px-6 py-12 text-center">
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
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <h3 class="mt-2 text-sm font-medium text-gray-900">
                        No warehouses found
                      </h3>
                      <p class="mt-1 text-sm text-gray-500">
                        Get started by adding a new warehouse.
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Summary -->
          <div v-if="warehouses.length > 0" class="mt-6 bg-gray-50 px-4 py-3 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Total warehouses:
                <span class="font-semibold">{{ warehouses.length }}</span>
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
