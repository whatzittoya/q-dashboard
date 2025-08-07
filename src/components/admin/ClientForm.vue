<script setup>
import { computed, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { mdiAccount, mdiAsterisk, mdiDetails, mdiEmail, mdiLink } from "@mdi/js";
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
  clientForm: { type: Object, default: () => {} },
});
const emit = defineEmits(["open-info-modal", "open-danger-modal", "update-client-form"]);
const isInfoOpen = computed({
  get: () => props.modalInfoOpen,
  set: (value) => emit("open-info-modal", value),
});
const isDangerOpen = computed({
  get: () => props.modalDangerOpen,
  set: (value) => emit("open-danger-modal", value),
});
const clientForm = computed({
  get: () => props.clientForm,
  set: (value) => emit("update-client-form", value),
});

const selectOptions = computed(() => {
  return mainStore.apiData.store.data;
});

const confirmDelete = async () => {
  axios({
    method: "POST",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    url: `${import.meta.env.VITE_API_URL}/client/delete/${clientForm.value.id}`,
  })
    .then(() => {
      isDangerOpen.value = false;
      const usemainstore = useMainStore();
      usemainstore.fetchClient();
    })
    .catch(() => {});
};

const registerClient = async () => {
  let url = "";
  let param = {};
  if (clientForm.value.id) {
    url = `${import.meta.env.VITE_API_URL}/client/update`;
    param = {
      id: clientForm.value.id,
      name: clientForm.value.name,
      email: clientForm.value.email,
      password: clientForm.value.password,
      description: clientForm.value.description,
      url: clientForm.value.url,
      admin_name: clientForm.value.admin_name,
      admin_email: clientForm.value.admin_email,
      admin_pass: clientForm.value.admin_pass,
    };
  } else {
    url = `${import.meta.env.VITE_API_URL}/client`;
    param = {
      name: clientForm.value.name,
      email: clientForm.value.email,
      password: clientForm.value.password,
      description: clientForm.value.description,
      url: clientForm.value.url,
      admin: clientForm.value.admin,
      admin_name: clientForm.value.admin_name,
      admin_email: clientForm.value.admin_email,
      admin_pass: clientForm.value.admin_pass,
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
      const usemainstore = useMainStore();
      usemainstore.fetchClient();
      // time sleep 1
      setTimeout(() => {
        isInfoOpen.value = false;
        notificationBar.value.show = false;
      }, 1000);
    })
    .catch(() => {
      notificationBar.value.show = true;
      notificationBar.value.text = "Client registration failed";
      notificationBar.value.color = "danger";
    });
};
</script>
<template>
  <CardBoxModal
    v-model="isInfoOpen"
    title="Client Form"
    has-cancel
    @confirm="registerClient"
  >
    <NotificationBar
      v-if="notificationBar.show"
      :color="notificationBar.color"
      :icon="mdiContrastCircle"
      :outline="notificationsOutline"
      @dismiss="notificationBar.show = false"
    >
      {{ notificationBar.text }}
    </NotificationBar>
    <div class="flex flex-row justify-between space-x-7">
      <div class="flex-1 flex-col items-center">
        <div class="py-4">
          <h2 class="text-xl font-semibold">Quinos Cloud</h2>
          <sub>QuinosCloud data</sub>
        </div>
        <FormField label="Name" help="Required. Client name">
          <FormControl
            v-model="clientForm.name"
            :icon="mdiAccount"
            name="u_name"
            type="text"
            required
          />
        </FormField>
        <FormField label="Description">
          <FormControl
            v-model="clientForm.description"
            :icon="mdiDetails"
            name="u_description"
            type="text"
          />
        </FormField>
        <FormField label="Email" help="Required. Client email">
          <FormControl
            v-model="clientForm.email"
            :icon="mdiEmail"
            name="email"
            type="text"
            required
          />
        </FormField>
        <FormField label="Password" help="Required. Client password">
          <FormControl
            v-model="clientForm.password"
            :icon="mdiAsterisk"
            name="password"
            type="password"
            required
            autocomplete="current-password"
          />
        </FormField>
        <FormField label="URL" help="Required. URL">
          <FormControl
            v-model="clientForm.url"
            :icon="mdiLink"
            name="u_url"
            type="text"
            required
          />
        </FormField>
      </div>
      <div class="flex-1 flex-col items-center">
        <div class="py-4">
          <h2 class="text-xl font-semibold">Admin Account</h2>
          <sub>To login to this app</sub>
        </div>

        <FormField label="Name" help="Required. admin name">
          <FormControl
            v-model="clientForm.admin_name"
            :icon="mdiAccount"
            name="u_aname"
            type="text"
            required
          />
        </FormField>
        <FormField label="Email" help="Required. admin email">
          <FormControl
            v-model="clientForm.admin_email"
            :icon="mdiEmail"
            name="u_aemail"
            type="text"
            required
          />
        </FormField>
        <FormField label="Password" help="Required. Admin password">
          <FormControl
            v-model="clientForm.admin_pass"
            :icon="mdiAsterisk"
            name="u_apass"
            type="password"
            required
            autocomplete="current-password"
          />
        </FormField>
      </div>
    </div>

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
    <p>Are you sure want to delete this client?</p>
  </CardBoxModal>
</template>
