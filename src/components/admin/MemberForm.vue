<script setup>
import { computed, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { mdiAccount, mdiAsterisk, mdiEmail } from "@mdi/js";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";

import NotificationBar from "@/components/NotificationBar.vue";
import axios from "axios";
import CardBoxModal from "@/components/CardBoxModal.vue";
const notificationBar = ref({ show: false, color: "success", text: "" });
const props = defineProps({
  modalInfoOpen: Boolean,
  modalDangerOpen: Boolean,
  infoData: { type: Object, default: () => {} },
  memberForm: { type: Object, default: () => {} },
});
const emit = defineEmits(["open-info-modal", "open-danger-modal", "update-member-form"]);
const storeSelect = ref(null);
const isInfoOpen = computed({
  get: () => props.modalInfoOpen,
  set: (value) => emit("open-info-modal", value),
});
const isDangerOpen = computed({
  get: () => props.modalDangerOpen,
  set: (value) => emit("open-danger-modal", value),
});
const memberForm = computed({
  get: () => props.memberForm,
  set: (value) => emit("update-member-form", value),
});
const mainStore = useMainStore();
mainStore.fetchQuinosStore();
const selectOptions = computed(() => {
  const st = mainStore.apiData.store.data
    .filter((item) => item.name.toLowerCase() !== "all")
    .map((item) => {
      return {
        label: item.long_name,
        value: item.name,
      };
    });
  return st;
});

const confirmDelete = async () => {
  axios({
    method: "POST",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    url: `${import.meta.env.VITE_API_URL}/delete-member/${memberForm.value.id}`,
  })
    .then(() => {
      isDangerOpen.value = false;
      const usemainstore = useMainStore();
      usemainstore.fetchMember();
    })
    .catch(() => {});
};

const registerMember = async () => {
  let url = "";
  let param = {};
  if (memberForm.value.id) {
    url = `${import.meta.env.VITE_API_URL}/update-member`;
    param = {
      id: memberForm.value.id,
      name: memberForm.value.name,
      email: memberForm.value.email,
      password: memberForm.value.password,
      location: memberForm.value.store.value,
    };
  } else {
    url = `${import.meta.env.VITE_API_URL}/add-member`;
    param = {
      name: memberForm.value.name,
      email: memberForm.value.email,
      password: memberForm.value.password,
      location: memberForm.value.store.value,
    };
  }
  axios({
    method: "POST",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    url: url,
    params: param,
  })
    .then((response) => {
      notificationBar.value.show = true;
      notificationBar.value.text = response.data.message;
      notificationBar.value.color = "success";
      const usemainstore = useMainStore();
      usemainstore.fetchMember();
      setTimeout(() => {
        isInfoOpen.value = false;
        notificationBar.value.show = false;
      }, 1000);
    })
    .catch((error) => {
      notificationBar.value.show = true;
      notificationBar.value.text = "Member registration failed";
      notificationBar.value.color = "danger";
    });
};
</script>
<template>
  <CardBoxModal
    v-model="isInfoOpen"
    title="Member Form"
    has-cancel
    @confirm="registerMember"
  >
    <NotificationBar
      v-if="notificationBar.show"
      :color="notificationBar.color"
      :icon="mdiContrastCircle"
      :outline="notificationsOutline"
    >
      {{ notificationBar.text }}
    </NotificationBar>
    <FormField label="Name" help="Required. Member name">
      <FormControl
        v-model="memberForm.name"
        :icon="mdiAccount"
        name="u_name"
        type="text"
        required
      />
    </FormField>
    <FormField label="Email" help="Required. Member email">
      <FormControl
        v-model="memberForm.email"
        :icon="mdiEmail"
        name="email"
        type="text"
        required
      />
    </FormField>
    <FormField label="Password" help="Required. Member password">
      <FormControl
        v-model="memberForm.password"
        :icon="mdiAsterisk"
        name="password"
        type="password"
        required
        autocomplete="current-password"
      />
    </FormField>
    <FormField label="Store" help="Required Store">
      <FormControl v-model="memberForm.store" :options="selectOptions" />
    </FormField>
    <!-- <template #footer>
            <BaseButtons>
              <BaseButton type="submit" color="info" label="Submit"  />
              <BaseButton color="info" label="Options" outline />
            </BaseButtons>
          </template> -->
  </CardBoxModal>

  <CardBoxModal
    v-model="isDangerOpen"
    title="Please confirm"
    button="danger"
    has-cancel
    @confirm="confirmDelete"
  >
    <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
    <p>This is sample modal</p>
  </CardBoxModal>
</template>
