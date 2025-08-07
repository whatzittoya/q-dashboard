<script setup>
import GenericTable from "@/components/Table/GenericTable.vue";
import { computed, ref } from "vue";
import { calculateGrandTotal } from "@/service/calculation";
import { formatNumber } from "@/service/formatNumber";

const props = defineProps({
  items: { format: Object, default: () => ({}) },
});
const mapTransactions = (data) => {
  return data.map((item) => {
    const transaction = item;
    return {
      ...transaction,
    };
  });
};
const itemSummary = computed(() => {
  if (!props.items.isLoading) {
    return {
      isLoading: false,
      data: props.items.data.trans,
      total: props.items.data.total,
    };
  }
  return props.items;
});

const dataList = [
  { label: "Date", obj: "date", format: "text" },
  { label: "Invoice", obj: "invoice", format: "text" },
  { label: "Pax", obj: "pax", format: "text" },
  { label: "Table", obj: "tbl", format: "text" },
  { label: "Customer", obj: "customer", format: "text" },
  { label: "Phone", obj: "phone", format: "text" },
  { label: "Store Code", obj: "store_code", format: "text" },
  { label: "Sales Type", obj: "sales_type", format: "text" },
  { label: "Category", obj: "category", format: "text" },
  { label: "Description", obj: "description", format: "text" },
  { label: "Modifier", obj: "modifier", format: "text" },
  { label: "Item Code", obj: "item_code", format: "text" },
  { label: "Time Hour", obj: "time_hour", format: "text" },
  { label: "Quantity", obj: "quantity", format: "text" },
  { label: "Quantity Percent", obj: "quantity_percent", format: "text" },
  { label: "Revenue", obj: "revenue", format: "text" },
  { label: "Revenue Percent", obj: "revenue_percent", format: "text" },
  { label: "Discount Desc", obj: "disc_desc", format: "text" },
  { label: "Discount", obj: "discount", format: "text" },
  { label: "Cost", obj: "cost", format: "currency" },
  { label: "Profit", obj: "profit", format: "text" },
  { label: "Service Charge", obj: "svc_charge", format: "text" },
  { label: "Tax", obj: "tax", format: "text" },
  { label: "Rounding", obj: "rounding", format: "text" },
  { label: "Total", obj: "total", format: "text" },
  { label: "Payment Method", obj: "payment_method", format: "text" },
];
</script>

<template>
  <div v-if="itemSummary.total" class="flex flex-wrap">
    <div class="w-1/3 px-4 mb-6">
      <label
        class="block uppercase tracking-wide text-gray-700 text-lg font-bold mb-2"
        for="grid-first-name"
      >
        Revenue : {{ formatNumber(itemSummary.total.total_revenue) }}
      </label>
    </div>
    <div class="w-1/3 px-4 mb-6">
      <label
        class="block uppercase tracking-wide text-gray-700 text-lg font-bold mb-2"
        for="grid-first-name"
      >
        Cost : {{ formatNumber(itemSummary.total.total_cost) }}
      </label>
    </div>
    <div class="w-1/3 px-4 mb-6">
      <label
        class="block uppercase tracking-wide text-gray-700 text-lg font-bold mb-2"
        for="grid-first-name"
      >
        Total : {{ formatNumber(itemSummary.total.total_total) }}
      </label>
    </div>
  </div>
  <GenericTable
    class="overflow-auto"
    :items="itemSummary"
    :data-attr="dataList"
    title="Daily Transaction"
    :has-paging="false"
    :has-edit="false"
    strip-indicator="invoice"
  ></GenericTable>
</template>
