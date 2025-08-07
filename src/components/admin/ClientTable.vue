<script setup>
import { computed } from "vue";
import { useMainStore } from "@/stores/main";

import GenericTable from "@/components/Table/GenericTable.vue";
import { mdiStore } from "@mdi/js";
defineProps({
  checkable: Boolean,
});

const mainStore = useMainStore();
mainStore.fetchClient();
const items = computed(() => {
  return mainStore.apiData.client;
});

const has_url = {
  url: "/client/{id}/store",
  target: "name",
  label: "Stores",
  icon: mdiStore,
};

const data_attr = [
  {
    label: "Name",
    obj: "name",
  },
  {
    label: "Description",
    obj: "description",
  },
  {
    label: "Email",
    obj: "email",
  },
  {
    label: "Url",
    obj: "url",
  },
];
</script>

<template>
  <GenericTable :items="items" :data-attr="data_attr" :has-url="has_url"></GenericTable>
</template>
