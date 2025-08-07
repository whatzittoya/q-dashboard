<script setup>
import { computed, ref } from "vue";
import { useMainStore } from "@/stores/main";
import {
  mdiAccount,
  mdiAsterisk,
  mdiDetails,
  mdiEmail,
  mdiLink,
  mdiStore,
} from "@mdi/js";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";

import NotificationBar from "@/components/NotificationBar.vue";
import axios from "axios";
import CardBoxModal from "@/components/CardBoxModal.vue";
const notificationBar = ref({ show: false, color: "success", text: "" });
const props = defineProps({
  modalInfoOpen: Boolean,
  client: { type: String, default: "" },

  infoData: { type: Object, default: () => {} },
  storeForm: { type: Object, default: () => {} },
});
const emit = defineEmits(["open-info-modal", "update-store-form"]);
const isInfoOpen = computed({
  get: () => props.modalInfoOpen,
  set: (value) => emit("open-info-modal", value),
});

const storeForm = computed({
  get: () => props.storeForm,
  set: (value) => emit("update-store-form", value),
});

const registerStore = async () => {
  let url = "";
  let param = {};
  if (storeForm.value.id) {
    url = `${import.meta.env.VITE_API_URL}/client/store`;
    param = {
      id: storeForm.value.id,
      name: storeForm.value.name,
      long_name: storeForm.value.long_name,
      description: storeForm.value.description,
    };
  }
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
      const mainStore = useMainStore();
      mainStore.fetchQuinosStoreAdmin(props.client);
      setTimeout(() => {
        isInfoOpen.value = false;
        notificationBar.value.show = false;
      }, 1000);
    })
    .catch(() => {
      notificationBar.value.show = true;
      notificationBar.value.text = "Store update failed";
      notificationBar.value.color = "danger";
    });
};
</script>
<template>
  <CardBoxModal
    v-model="isInfoOpen"
    title="Store Form"
    has-cancel
    @confirm="registerStore"
  >
    <NotificationBar
      v-if="notificationBar.show"
      :color="notificationBar.color"
      :icon="mdiContrastCircle"
      :outline="notificationsOutline"
    >
      {{ notificationBar.text }}
    </NotificationBar>
    <FormField label="Name" help="Required. Store name">
      <FormControl
        v-model="storeForm.name"
        :icon="mdiStore"
        name="u_name"
        type="text"
        required
      />
    </FormField>
    <FormField label="Long Name">
      <FormControl
        v-model="storeForm.long_name"
        :icon="mdiStore"
        name="u_long_name"
        type="text"
      />
    </FormField>
    <FormField label="Description">
      <FormControl
        v-model="storeForm.description"
        :icon="mdiDetails"
        name="u_description"
        type="text"
      />
    </FormField>
  </CardBoxModal>
</template>
