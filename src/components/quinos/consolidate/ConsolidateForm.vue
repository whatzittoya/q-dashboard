<script setup>
import { computed, reactive, ref } from "vue";
import { useMainStore } from "@/stores/main";
import {
  mdiAccount,
  mdiMail,
  mdiAsterisk,
  mdiFormTextboxPassword,
  mdiEmail,
  mdiCurrencyUsd,
} from "@mdi/js";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";

import NotificationBar from "@/components/NotificationBar.vue";
import axios from "axios";
import CardBoxModal from "@/components/CardBoxModal.vue";
const notificationBar = ref({ show: false, color: "success", text: "" });
const props = defineProps({
  modalInfoOpen: Boolean,
  modalDangerOpen: Boolean,
  infoData: { type: Object, default: () => {} },
  consolidateForm: { type: Object, default: () => {} },
});
const emit = defineEmits(["open-info-modal", "update-consolidate-form"]);
const isInfoOpen = computed({
  get: () => props.modalInfoOpen,
  set: (value) => emit("open-info-modal", value),
});

const consolidateForm = computed({
  get: () => props.consolidateForm,
  set: (value) => emit("update-consolidate-form", value),
});

const mainStore = useMainStore();

const selectOptions = computed(() => {
  return mainStore.apiData.store.data;
});

const updateConsolidate = async () => {
  let url = "";
  let param = {};
  url = `${import.meta.env.VITE_API_URL}/report/consolidate-additional`;
  param = {
    date: consolidateForm.value.date,
    store: mainStore.getStore().name,
    Target_Revenue: consolidateForm.value.Target_Revenue,
    isHoliday: consolidateForm.value.isHoliday == "Yes" ? 1 : 0,
  };
  axios({
    method: "POST",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    url: url,
    data: param,
  })
    .then((response) => {
      notificationBar.value.show = true;
      notificationBar.value.text = response.data.message;
      notificationBar.value.color = "success";
      const usemainstore = useMainStore();

      usemainstore.fetchConsolidateDashboard(
        consolidateForm.value.month,
        consolidateForm.value.year,
        consolidateForm.value.store
      );
      setTimeout(() => {
        isInfoOpen.value = false;
        notificationBar.value.show = false;
      }, 1000);
    })
    .catch((error) => {
      notificationBar.value.show = true;
      notificationBar.value.text = "Update failed";
      notificationBar.value.color = "danger";
    });
};
</script>
<template>
  <CardBoxModal
    v-model="isInfoOpen"
    title="Member Form"
    has-cancel
    @confirm="updateConsolidate"
  >
    <NotificationBar
      v-if="notificationBar.show"
      :color="notificationBar.color"
      :icon="mdiContrastCircle"
      :outline="notificationsOutline"
    >
      {{ notificationBar.text }}
    </NotificationBar>
    <FormField label="Date">
      <label>{{ consolidateForm.date }}</label>
    </FormField>
    <FormField label="Store">
      <label>{{ consolidateForm.store }}</label>
    </FormField>
    <FormField label="Target Revenue" help="Required">
      <FormControl
        v-model="consolidateForm.Target_Revenue"
        :icon="mdiCurrencyUsd"
        type="number"
        required
      />
    </FormField>

    <FormField label="Is Holiday" help="Required">
      <FormControl v-model="consolidateForm.isHoliday" :options="['Yes', 'No']" />
    </FormField>
  </CardBoxModal>
</template>
