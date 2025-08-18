<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import CardBox from "@/components/CardBox.vue";
import { mdiPackageVariant } from "@mdi/js";
import SearchBoxWarehouse from "@/components/quinos/form/SearchBoxWarehouse.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useMainStore } from "@/stores/main";
import StockTable from "@/components/quinos/stockmovement/StockTable.vue";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

const mainStore = useMainStore();
const selectedDate = ref("");
const poRegistered = ref([]);
const showPODropdown = ref(false);
const poSearchTerm = ref("");

const isLoading = computed(() => {
  return mainStore.apiData.stock_movement.isLoading;
});

const purchaseOrders = computed(() => {
  return mainStore.apiData.purchase_orders.data?.data || [];
});

const filteredPOs = computed(() => {
  if (!poSearchTerm.value) return purchaseOrders.value;
  return purchaseOrders.value.filter(
    (po) =>
      po.po_id.toLowerCase().includes(poSearchTerm.value.toLowerCase()) ||
      po.supplier_name.toLowerCase().includes(poSearchTerm.value.toLowerCase()) ||
      po.date.includes(poSearchTerm.value)
  );
});

const addPO = (po) => {
  if (!poRegistered.value.find((p) => p.po_id === po.po_id)) {
    poRegistered.value.push(po);
  }
  poSearchTerm.value = "";
  showPODropdown.value = false;
};

const removePO = (poId) => {
  const index = poRegistered.value.findIndex((p) => p.po_id === poId);
  if (index !== -1) {
    poRegistered.value.splice(index, 1);
  }
};

const getReport = async (date, refresh = false) => {
  selectedDate.value = date;
  // Loading state is now managed by the store
  mainStore.fetchStockMovement(date, refresh);
};

// Watch for stock movement data changes and add POs to selected state
watch(() => mainStore.apiData.stock_movement.data, (newData) => {
  if (newData && newData.po_ids && newData.po_ids.length > 0) {
    // Add fetched POs to selected state if they don't already exist
    newData.po_ids.forEach(poId => {
      if (!poRegistered.value.some(po => po.po_id === poId)) {
        poRegistered.value.push({ po_id: poId });
      }
    });
  }
}, { deep: true });

const arrayWarehouse = computed(() => {
  // Extract warehouse names from the first item's properties
  if (formatedStock.value && formatedStock.value.length > 0) {
    const firstItem = formatedStock.value[0];
    const warehouseNames = Object.keys(firstItem).filter(
      (key) =>
        // Filter out non-warehouse properties
        !["code", "name", "category", "item_id"].includes(key) &&
        !key.includes("-requested")
    );

    // Create columns for both stock and requested for each warehouse
    const columns = [];
    warehouseNames.forEach((warehouse) => {
      columns.push(warehouse); // Stock column
      columns.push(`${warehouse} (req)`); // Requested column with custom format
    });

    return columns;
  }
  return [];
});

// New API returns data already formatted, so we can use it directly
const formatedStock = computed(() => {
  return mainStore.apiData.stock_movement.data.data || [];
});

function exportExcel() {
  var table_elt = document.getElementById("table-stock-movement");

  // Extract Data (create a workbook object from the table)
  var workbook = XLSX.utils.table_to_book(table_elt);

  // Process Data (add a new row)

  // Package and Release Data (`writeFile` tries to write and save an XLSB file)
  XLSX.writeFile(workbook, `stock-movement-${selectedDate.value}.xlsx`);
}

// Add PDF export function
async function exportPDF() {
  const doc = new jsPDF("landscape");

  // Set title
  doc.setFontSize(12);
  doc.text(`Stock Movement Report - ${selectedDate.value}`, 14, 15);

  // Prepare headers and data for the table
  const headers = ["Code", "Name", "Category", ...arrayWarehouse.value, "Total"];

  // Transform the data into rows
  const data = formatedStock.value.map((item) => {
    return [
      item.code,
      item.name,
      item.category,
      ...arrayWarehouse.value.map((warehouse) => item[warehouse] || "-"),
      arrayWarehouse.value.reduce((sum, warehouse) => {
        const val = Number(item[warehouse]);
        return sum + (isNaN(val) ? 0 : val);
      }, 0),
    ];
  });

  // Generate table
  autoTable(doc, {
    startY: 25,
    head: [headers],
    body: data,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontSize: 9,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  doc.save(`stock-movement-${selectedDate.value}.pdf`);
}

const updatePO = () => {
  if (selectedDate.value && poRegistered.value.length > 0) {
    mainStore.updatePurchaseOrders(selectedDate.value, poRegistered.value);
  }
};

onMounted(() => {
  if (mainStore.apiData.warehouse.data.length == 0) {
    mainStore.fetchWarehouse();
  }
  if (mainStore.apiData.purchase_orders.data.length == 0) {
    mainStore.fetchPurchaseOrders();
  }
});
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiPackageVariant" title="Stock Movement" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <SearchBoxWarehouse
          has-date
          :loading="isLoading"
          @search-data="getReport"
          @date-changed="(date) => (selectedDate = date)"
        ></SearchBoxWarehouse>

        <!-- PO Selection Section -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-4">
              <h3 class="text-lg font-semibold text-gray-700">Purchase Orders</h3>
              <!-- Selected PO Tags -->
              <div v-if="poRegistered.length > 0" class="flex flex-wrap gap-2">
                <div
                  v-for="po in poRegistered"
                  :key="po.po_id"
                  class="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                >
                  <span>{{ po.po_id }}</span>
                  <button
                    class="ml-1 text-gray-600 hover:text-gray-800"
                    @click="removePO(po.po_id)"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
              <!-- Plus Icon to Add PO -->
              <button
                :disabled="!selectedDate"
                class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                @click="showPODropdown = !showPODropdown"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
              </button>
            </div>
            <!-- Update PO Button -->
            <button
              v-if="poRegistered.length > 0"
              :disabled="!selectedDate"
              class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              @click="updatePO"
            >
              Update PO
            </button>
          </div>

          <!-- PO Search Dropdown -->
          <div v-if="showPODropdown" class="relative mb-4">
            <input
              v-model="poSearchTerm"
              type="text"
              placeholder="Search PO by ID, supplier, or date..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <!-- Dropdown Results -->
            <div
              v-if="filteredPOs.length > 0 && poSearchTerm"
              class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
            >
              <div
                v-for="po in filteredPOs"
                :key="po.po_id"
                class="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                @click="addPO(po)"
              >
                <div class="font-medium text-gray-900">{{ po.po_id }}</div>
                <div class="text-sm text-gray-600">
                  {{ po.supplier_name }} • {{ po.date }}
                </div>
                <div class="text-sm text-gray-500">Total: {{ po.total }}</div>
              </div>
            </div>
          </div>
        </div>

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
                  Loading stock movement data...
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end mb-4 space-x-4">
            <!-- Add PDF export button -->
            <button
              class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow flex items-center gap-2"
              @click="exportPDF"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              Export PDF
            </button>

            <!-- Existing Excel button -->
            <button
              class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow flex items-center gap-2"
              :disabled="!formatedStock.length"
              @click="exportExcel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Export Excel
            </button>
          </div>
          <!-- Table always visible -->
          <StockTable
            :items="formatedStock"
            :other-columns="arrayWarehouse"
            :selected-date="selectedDate"
          ></StockTable>
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script>
export default {};
</script>

<style>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
