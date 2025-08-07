<script setup>
import { computed } from "vue";
import { useMainStore } from "@/stores/main";
import { formatCurrency } from "@/service/formatNumber";
import { formatNumber } from "@/service/formatNumber";
import TableLoading from "../skeleton/TableLoading.vue";
import BaseButton from "@/components/BaseButton.vue";
import * as XLSX from "xlsx";

const props = defineProps({
  items: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["open-info-modal"]);
const openInfoModal = (data, date) => {
  if (isInthisMonth(date) && mainStore.current_store.toLowerCase() != "all") {
    emit("open-info-modal", true, {
      ...data,
      month: mainStore.date_month,
      year: mainStore.date_year,
      date: date,
    });
  }
};
const mainStore = useMainStore();
const consolidate = computed(() => {
  if (!props.items.isLoading) {
    return {
      isLoading: false,
      data: props.items.data.consolidate,
    };
  }
  return props.items;
});
const consolidate_additional = computed(() => {
  if (!props.items.isLoading) {
    return {
      isLoading: false,
      data: props.items.data.consolidate_additional,
    };
  }
  return props.items;
});

const name_report = computed(() => {
  try {
    return `CONSOLIDATE REPORT - ${mainStore.getStore().long_name} -
             ${mainStore.date_year}/${mainStore.date_month} `;
  } catch {
    return `CONSOLIDATE REPORT`;
  }
});

const filterByDate = (date) => {
  const filter_date = consolidate.value.data.filter((item) => item.date === date);
  const filter_date_additional = consolidate_additional.value.data.filter(
    (item) => item.cons_date === date
  );
  const new_obj = [{ ...filter_date[0], ...filter_date_additional[0] }];
  if (filter_date.length === 0 && filter_date_additional.length === 0) {
    return [null];
  }

  return new_obj;
};

const colorDay = (day, isholiday) => {
  switch (day.toString().toLowerCase()) {
    case "minggu":
      return "bg-red-200";
    case "sabtu":
      return "bg-orange-200";

    default:
      if (isholiday > 0) {
        // console.log(isholiday);
        return "bg-orange-400";
      }
      return "bg-blue-100";
  }
};

const isInthisMonth = (date) => {
  if (!mainStore.date_year && !mainStore.date_month) {
    return false;
  }
  const currentYear = parseInt(mainStore.date_year);
  const currentMonth = mainStore.date_month - 1;
  const d = new Date(date);
  return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
};

const weeks = computed(() => {
  if (!mainStore.date_year && !mainStore.date_month) {
    return;
  }
  const currentYear = mainStore.date_year;
  const currentMonth = mainStore.date_month - 1;
  console.log(currentYear, currentMonth);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const name_of_days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  const weeks = {};
  const currentDate = new Date(currentYear, currentMonth, 1);
  const currentDay = currentDate.getDay();
  const currentDay_name = new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(
    currentDate
  );
  const indexStart = name_of_days.findIndex((day) => day === currentDay_name);
  const daysInWeek = 7;
  for (let i = -indexStart; i < lastDayOfMonth; i += daysInWeek) {
    const weekDates = [];
    for (let j = 0; j < daysInWeek; j++) {
      const date = new Date(currentDate.getTime() + (i + j) * 24 * 60 * 60 * 1000);
      weekDates.push({
        date: formatDate(date),
        day: new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(date),
      });
    }
    const weekNumber = Math.floor((i + currentDay) / daysInWeek) + 1;
    weeks[weekNumber] = weekDates;
  }
  return weeks;
});
function exportExcel() {
  var table_elt = document.getElementById("table-consolidate");

  // Extract Data (create a workbook object from the table)
  var workbook = XLSX.utils.table_to_book(table_elt);

  // Process Data (add a new row)

  // Package and Release Data (`writeFile` tries to write and save an XLSB file)
  XLSX.writeFile(workbook, `${name_report.value}.xlsx`);
}
</script>

<template>
  <div class="flex justify-start py-2">
    <BaseButton
      color="success"
      label="Export to Excel"
      :disabled="isLoading"
      @click="exportExcel()"
    ></BaseButton>
  </div>
  <!-- <table id="my-table-id" class="border-solid border-2 border-indigo-600 ..." > -->

  <table
    id="table-consolidate"
    :key="index"
    class="min-w-full border-spacing-0 border border-gray-300"
  >
    <thead>
      <tr>
        <td colspan="11">
          <span class="text-2xl text-gray-700 font-bold">{{ name_report }}</span>
        </td>
      </tr>
      <tr>
        <td>Week</td>
        <td>Days</td>
        <td>Date</td>
        <td>Target Revenue</td>
        <td>Actual Revenue</td>
        <td>Pax</td>
        <td>Average Pax</td>
        <td>Main Course</td>
        <td>Side Dish</td>
        <td>Dessert</td>
        <td>Beverages</td>
      </tr>
    </thead>
    <tbody>
      <TableLoading v-if="consolidate.isLoading" :num-col="11" :row="4"></TableLoading>
      <template v-else>
        <template v-for="(week, index) in weeks">
          <tr v-for="(day, i) in week" :key="i">
            <template v-for="(item, j) in filterByDate(day.date)" :key="j">
              <td v-if="day.day === 'Senin'" rowspan="7">Week {{ Number(index) }}</td>
              <td :class="colorDay(day.day, item?.isHoliday)">{{ day.day }}</td>
              <td :class="colorDay(day.day, item?.isHoliday)">{{ day.date }}</td>
              <td
                :class="
                  isInthisMonth(day.date) ? 'hover:cursor-pointer hover:bg-green-200' : ''
                "
                @click="openInfoModal(item, day.date)"
              >
                {{ formatCurrency(item?.Target_Revenue) }}
              </td>
              <td
                :class="item?.Target_Revenue < item?.Actual_Revenue ? 'bg-green-300' : ''"
              >
                {{ formatCurrency(item?.Actual_Revenue) }}
              </td>
              <td>{{ formatNumber(item?.Pax) }}</td>
              <td>{{ formatNumber(item?.Average_Pax) }}</td>
              <td>{{ formatCurrency(item?.Main_Course) }}</td>
              <td>{{ formatCurrency(item?.Side_Dish) }}</td>
              <td>{{ formatCurrency(item?.Dessert) }}</td>
              <td>{{ formatCurrency(item?.Beverage) }}</td>
            </template>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
</template>
