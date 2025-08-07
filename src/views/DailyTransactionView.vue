<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/SectionMain.vue";
import TransactionTable from "@/components/quinos/transaction/TransactionTable.vue";
import SearchBox from "@/components/quinos/form/SearchBox.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import CardBox from "@/components/CardBox.vue";
import { mdiCurrencyUsd } from "@mdi/js";
import { useMainStore } from "@/stores/main";
import DailyTransactionTable from "@/components/quinos/dailytransaction/DailyTransactionTable.vue";
import { computed, ref } from "vue";
import BaseButton from "@/components/BaseButton.vue";

import * as XLSX from "xlsx";
import fs from "node:fs";

const mainStore = useMainStore();
const getDailyTransaction = (date1, date2, store) => {
  const encodedStore = store.replace(/\./g, "*");
  name_report.value = `daily_transaction_${date1}-${date2}-${encodedStore}`;
  mainStore.fetchDailyTransaction(date1, date2, encodedStore);
};

const name_report = ref("");
const ItemDailyTransaction = computed(() => {
  if (!mainStore.apiData.daily_transaction.isLoading) {
    try {
      return { isLoading: false, data: mainStore.apiData.daily_transaction.data };
    } catch {
      return { isLoading: false, data: [] };
    }
  }
  return mainStore.apiData.daily_transaction;
});
function exportExcel() {
  var table_elt = document.getElementById("report-table");

  // Extract Data (create a workbook object from the table)
  var workbook = XLSX.utils.table_to_book(table_elt);

  // Process Data (add a new row)

  // Package and Release Data (`writeFile` tries to write and save an XLSB file)
  XLSX.writeFile(workbook, `${name_report.value}.xlsx`);
  // var stream = XLSX.stream.to_csv(workbook);
  // stream.pipe(fs.createWriteStream(`${name_report.value}.csv`));
}

function objectToCSV() {
  const object = ItemDailyTransaction.value.data.trans;
  var csv = [];
  var keys = Object.keys(object[0]);
  csv.push(keys.join(";"));
  for (var i = 0; i < object.length; i++) {
    var line = [];
    for (var key in object[i]) {
      line.push(object[i][key]);
    }
    csv.push(line.join(";"));
  }
  downloadCSVFile(csv.join("\n"));
}
function exportCSV() {
  // Variable to store the final csv data
  let csv_data = [];
  var table_elt = document.getElementById("report-table");
  // Get each row data
  let rows = table_elt.querySelectorAll("tr");
  for (let i = 0; i < rows.length; i++) {
    // Get each column data
    let cols = rows[i].querySelectorAll("td,th");

    // Stores each csv row data
    let csvrow = [];
    for (let j = 0; j < cols.length; j++) {
      // Get the text data of each cell
      // of a row and push it to csvrow
      if (!cols[j].querySelector("div")) {
        csvrow.push(cols[j].innerHTML);
      }
    }

    // Combine each column value with comma
    csv_data.push(csvrow.join(";"));
  }

  // Combine each row data with new line character
  csv_data = csv_data.join("\n");

  // Call this function to download csv file
  downloadCSVFile(csv_data);
}

function downloadCSVFile(csv_data) {
  // Create CSV file object and feed
  // our csv_data into it
  const CSVFile = new Blob([csv_data], {
    type: "text/csv",
  });

  // Create to temporary link to initiate
  // download process
  let temp_link = document.createElement("a");

  // Download csv file
  temp_link.download = `${name_report.value}.csv`;
  let url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;

  // This link should not be displayed
  temp_link.style.display = "none";
  document.body.appendChild(temp_link);

  // Automatically click the link to
  // trigger download
  temp_link.click();
  document.body.removeChild(temp_link);
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <!-- {{ mainStore.apiData.daily_transaction }} -->
      <SectionTitleLineWithButton :icon="mdiCurrencyUsd" title="Daily Transaction" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <SearchBox @search-data="getDailyTransaction"></SearchBox>
        <BaseButton
          color="success"
          label="Export to Excel"
          :disabled="ItemDailyTransaction.isLoading"
          class="p-2 m-3"
          @click="exportExcel()"
        ></BaseButton>
        <BaseButton
          color="success"
          label="Export to CSV"
          :disabled="ItemDailyTransaction.isLoading"
          @click="objectToCSV()"
        ></BaseButton>
        <DailyTransactionTable :items="ItemDailyTransaction"></DailyTransactionTable>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script>
export default {};
</script>

<style></style>
