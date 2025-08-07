<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import CardBox from "@/components/CardBox.vue";
import { mdiPackageVariant } from "@mdi/js";
import SearchBoxWarehouse from "@/components/quinos/form/SearchBoxWarehouse.vue";
import { computed, onMounted, ref } from "vue";
import { useMainStore } from "@/stores/main";
import StockTable from "@/components/quinos/stockmovement/StockTable.vue";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

const mainStore = useMainStore();
const selectedDate = ref("");

const isLoading = computed(() => {
  return mainStore.apiData.stock_movement.isLoading;
});

const getReport = async (date) => {
  selectedDate.value = date;
  // Loading state is now managed by the store
  mainStore.fetchStockMovement(date);
};

const arrayWarehouse = computed(() => {
  // Extract warehouse names from the first item's properties
  if (formatedStock.value && formatedStock.value.length > 0) {
    const firstItem = formatedStock.value[0];
    const warehouseNames = Object.keys(firstItem).filter(
      (key) =>
        // Filter out non-warehouse properties
        !["code", "name", "category", "item_id", "po"].includes(key) && !key.includes("-requested")
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

const handlePOUpdated = (updatedItem) => {
  // Update the local data without refetching
  const index = formatedStock.value.findIndex(item => item.code === updatedItem.code);
  if (index !== -1) {
    formatedStock.value[index].po = updatedItem.po;
  }
};

onMounted(() => {
  if (mainStore.apiData.warehouse.data.length == 0) {
    mainStore.fetchWarehouse();
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
        ></SearchBoxWarehouse>

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
            @po-updated="handlePOUpdated"
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
