<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import CardBox from "@/components/CardBox.vue";
import { mdiCurrencyUsd } from "@mdi/js";
import BaseButton from "@/components/BaseButton.vue";
import TableSampleClients from "@/components/TableSampleClients.vue";
import { useMainStore } from "@/stores/main";
import { computed, onMounted, reactive, ref } from "vue";
import ConsolidateDashboard from "../components/quinos/consolidate/ConsolidateDashboard.vue";
import SearchBox from "@/components/quinos/form/SearchBox.vue";
import ConsolidateForm from "@/components/quinos/consolidate/ConsolidateForm.vue";

const mainStore = useMainStore();
const getReport = (month, year, store) => {
  mainStore.fetchConsolidateDashboard(month, year, store);
};
const Consolidate = computed(() => {
  if (!mainStore.apiData.consolidate_dashboard.isLoading) {
    try {
      return { isLoading: false, data: mainStore.apiData.consolidate_dashboard.data };
    } catch {
      return { isLoading: false, data: [] };
    }
  }
  return mainStore.apiData.consolidate_dashboard;
});
onMounted(() => {
  mainStore.clearApiData("consolidate_dashboard");
});

const emptyConsolidateForm = () => ({
  id: "",
  targetRevenue: "",
  isHoliday: "",
});
const consolidateForm = reactive(emptyConsolidateForm());
const updateConsolidateForm = ($data = emptyConsolidateForm()) => {
  const setConsolidateForm = (data) => ({
    id: data.id,
    date: data?.date ? data.date : "",
    store: data?.store ? data.store : mainStore.getStore().long_name,
    month: data?.month ? data.month : "",
    year: data?.year ? data.year : "",
    Target_Revenue: data?.Target_Revenue ? data.Target_Revenue : "",
    isHoliday: data.isHoliday == 1 ? "Yes" : "No",
  });
  Object.assign(consolidateForm, setConsolidateForm($data));
};
const isModalActive = ref(false);

const openInfoModal = ($val, $data) => {
  isModalActive.value = $val;
  updateConsolidateForm($data);
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiCurrencyUsd" title="Transaction" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <SearchBox :has-date="false" has-month @search-data="getReport"></SearchBox>
        <ConsolidateForm
          :modal-info-open="isModalActive"
          :consolidate-form="consolidateForm"
          @open-info-modal="openInfoModal"
          @update-consolidate-form="updateConsolidateForm"
        ></ConsolidateForm>
        <ConsolidateDashboard :items="Consolidate" @open-info-modal="openInfoModal" />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script>
export default {
  components: { ConsolidateDashboard },
};
</script>

<style></style>
