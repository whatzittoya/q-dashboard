<script setup>
import { computed, onMounted } from "vue";
import { useMainStore } from "@/stores/main";

import GenericTable from "@/components/Table/GenericTable.vue";
import { mdiAccount } from "@mdi/js";
const props = defineProps({
  checkable: Boolean,
  client: { type: String, default: "" },
});

const mainStore = useMainStore();

onMounted(() => {
  if (mainStore.apiData.store.data.length == 0) {
    mainStore.fetchQuinosStoreAdmin(props.client);
  }
});
const items = computed(() => {
  const data = mainStore.apiData.store.data.filter((store) => store.name !== "All");
  return { data, isLoading: mainStore.apiData.store.isLoading };
});

const data_attr = [
  {
    label: "Name",
    obj: "name",
  },
  {
    label: "Long Name",
    obj: "long_name",
  },
  {
    label: "Description",
    obj: "description",
  },
];
</script>

<template>
  <GenericTable
    :items="items"
    :data-attr="data_attr"
    :has-edit="{ edit: true, delete: false }"
  ></GenericTable>
</template>
