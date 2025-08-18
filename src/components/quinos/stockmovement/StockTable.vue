<script setup>
import { ref, computed } from "vue";

// Dummy data
const columns = ["name", "code", "category"];
const props = defineProps({
  items: { type: Array, default: () => [] },
  otherColumns: { type: Array, default: () => [] },
  selectedDate: { type: String, default: "" },
});

const sortKey = ref("name");
const sortOrders = ref({
  name: 1,
  code: 1,
  category: 1,
  total: 1,
});

// Add new refs for column filters
const columnFilters = ref({
  name: "",
  code: "",
  warehouse: "",
});

const activeFilter = ref(""); // Track which filter is currently active

const toggleFilter = (key) => {
  activeFilter.value = activeFilter.value === key ? "" : key;
};

const sortBy = (key) => {
  sortKey.value = key;
  sortOrders.value[key] = sortOrders.value[key] * -1;
};

// Modified filteredAndSortedItems to include conditions when available
const filteredAndSortedItems = computed(() => {
  let filtered = props.items
    .map((item) => ({
      ...item,
      total: getTotal(item), // Add total to each item for sorting
    }))
    .filter((item) => {
      return Object.keys(columnFilters.value).every((key) => {
        const filterValue = columnFilters.value[key].toLowerCase();
        const itemValue = item[key]?.toString().toLowerCase() || "";
        return filterValue === "" || itemValue.includes(filterValue);
      });
    });

  return filtered.sort((a, b) => {
    let order = sortOrders.value[sortKey.value];
    if (sortKey.value === "total") {
      return order * (a.total - b.total);
    }
    if (a[sortKey.value] === "-" || b[sortKey.value] === "-") return 0;
    return a[sortKey.value] === b[sortKey.value]
      ? 0
      : a[sortKey.value] > b[sortKey.value]
      ? order
      : -order;
  });
});

const getTotal = (item) => {
  return props.otherColumns.reduce((total, col) => {
    // Only sum stock columns (not requested columns)
    if (!col.includes(" (req)")) {
      const value = parseFloat(item[col]) || 0;
      return total + value;
    }
    return total;
  }, 0);
};

// Helper function to get actual data property from display column name
const getDataValue = (item, col) => {
  if (col.includes(" (req)")) {
    const warehouseName = col.replace(" (req)", "");
    return item[`${warehouseName}-requested`] || 0;
  }
  return item[col] || 0;
};
</script>

<template>
  <div class="p-1">
    <div class="relative max-h-[70vh] overflow-auto">
      <table id="table-stock-movement" ref="dataTable" class="min-w-full bg-white border">
        <thead class="sticky top-0 bg-white shadow-sm z-10">
          <tr>
            <!-- Fixed columns -->
            <th
              v-for="key in columns"
              :key="key"
              class="px-3 py-2 border-b"
              :class="{
                'w-40': key === 'name',
                'w-32': key === 'code',
                'w-32': key === 'category',
              }"
            >
              <div class="flex items-center justify-between">
                <div
                  class="flex items-center space-x-2"
                  :class="{
                    'cursor-pointer':
                      key === 'name' || key === 'category' || key === 'code',
                  }"
                  @click="
                    (key === 'name' || key === 'category' || key === 'code') &&
                      sortBy(key)
                  "
                >
                  <span>{{ key.charAt(0).toUpperCase() + key.slice(1) }}</span>
                  <span v-if="sortKey === key">
                    {{ sortOrders[key] > 0 ? "↑" : "↓" }}
                  </span>
                </div>
                <button class="p-1 hover:bg-gray-100 rounded" @click="toggleFilter(key)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                </button>
              </div>
              <!-- Column Filter Input -->
              <div v-if="activeFilter === key" class="mt-2">
                <input
                  v-model="columnFilters[key]"
                  class="w-full p-1 text-sm border rounded"
                  :placeholder="`Filter ${key}...`"
                  @click.stop
                />
              </div>
            </th>

            <!-- Warehouse columns -->
            <th
              v-for="key in props.otherColumns"
              :key="key"
              class="px-3 py-2 border-b w-24"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span>{{ key.charAt(0).toUpperCase() + key.slice(1) }}</span>
                </div>
                <button class="p-1 hover:bg-gray-100 rounded" @click="toggleFilter(key)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                </button>
              </div>
              <!-- Column Filter Input -->
              <div v-if="activeFilter === key" class="mt-2">
                <input
                  v-model="columnFilters[key]"
                  class="w-full p-1 text-sm border rounded"
                  :placeholder="`Filter ${key}...`"
                  @click.stop
                />
              </div>
            </th>

            <!-- Total column -->
            <th class="px-3 py-2 border-b w-24">
              <div
                class="flex items-center justify-between cursor-pointer"
                @click="sortBy('total')"
              >
                <span>Total</span>
                <span v-if="sortKey === 'total'">
                  {{ sortOrders.total > 0 ? "↑" : "↓" }}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filteredAndSortedItems"
            :key="item.code"
            class="hover:bg-gray-100"
          >
            <td class="px-3 py-2 border-b">{{ item.name }}</td>
            <td class="px-3 py-2 border-b">{{ item.code }}</td>
            <td class="px-3 py-2 border-b">{{ item.category }}</td>

            <td
              v-for="(col, index) in props.otherColumns"
              :key="index"
              class="px-3 py-2 border-b text-right"
              :class="{
                'text-red-600 font-semibold': parseFloat(getDataValue(item, col)) < 0,
              }"
            >
              {{ getDataValue(item, col) }}
            </td>

            <td class="px-3 py-2 border-b font-bold text-right">{{ getTotal(item) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="px-3 py-2 border-b font-bold">Total</td>
            <td
              v-for="(col, index) in props.otherColumns"
              :key="index"
              class="px-3 py-2 border-b font-bold text-right"
              :class="{
                'bg-gray-50 text-gray-600': col.includes(' (req)'),
              }"
            >
              <span v-if="col.includes(' (req)')">-</span>
              <span v-else>
                {{
                  filteredAndSortedItems.reduce(
                    (sum, item) => sum + parseFloat(getDataValue(item, col) || 0),
                    0
                  )
                }}
              </span>
            </td>
            <td class="px-3 py-2 border-b font-bold text-right">
              {{ filteredAndSortedItems.reduce((sum, item) => sum + getTotal(item), 0) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
