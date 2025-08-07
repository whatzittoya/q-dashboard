<script setup>
import CardReport from "@/components/Table/CardReport.vue";
import { computed, ref } from "vue";
import { calculateGrandTotal } from "@/service/calculation";
import { useMainStore } from "@/stores/main";

const props = defineProps({
  items: { type: Object, default: () => ({}) },
});
const name = ref("child component");
const appendTotal = (data) => {
  const propertiesToSum = ["subtotal", "discount", "service_charge", "tax", "rounding"];
  const grandTotal = calculateGrandTotal(data, propertiesToSum);
  const days = daysBetween(mainStore.date_start, mainStore.date_end);
  // console.log('Total hari ' + days)
  const avgSales = grandTotal / days;
  data["grand_total"] = grandTotal;
  data["avg_sales"] = avgSales;
  return data;
};
const itemSummary = computed(() => {
  if (!props.items.isLoading) {
    return {
      isLoading: false,
      data: appendTotal(props.items.data),
    };
  }
  return props.items;
});
const mainStore = useMainStore();

function daysBetween(date_start, date_end) {
  var startDate = new Date(date_start);
  var endDate = new Date(date_end);
  var millisecondsPerDay = 1000 * 60 * 60 * 24;
  var millisecondsBetween = endDate.getTime() - startDate.getTime();
  var days = millisecondsBetween / millisecondsPerDay;
  return Math.floor(days) + 1;
}

const dataList = [
  { label: "Subtotal", obj: "subtotal", type: "currency" },
  { label: "Discount", obj: "discount", type: "currency" },
  { label: "Service Charge", obj: "service_charge", type: "currency" },
  { label: "Tax", obj: "tax", type: "currency" },
  { label: "Rounding", obj: "rounding", type: "currency" },
  { label: "Grand Total", obj: "grand_total", type: "currency" },
  { label: "Avg Sales/Day", obj: "avg_sales", type: "currency" },
];
defineExpose({
  itemSummary,
});
</script>

<template>
  <CardReport
    :items="itemSummary"
    :data-list="dataList"
    title="Revenue"
    :transformed="true"
  ></CardReport>
</template>
