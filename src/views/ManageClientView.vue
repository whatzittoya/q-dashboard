<script setup>
import { reactive, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { mdiAccount, mdiPlusCircle } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import BaseButton from "@/components/BaseButton.vue";
import ClientForm from "@/components/admin/ClientForm.vue";
import ClientTable from "@/components/admin/ClientTable.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import CardBox from "@/components/CardBox.vue";
const isModalActive = ref(false);
const infoData = ref({});
const ClientFormRef = ref();
const isModalDangerActive = ref(false);
const emptyClientForm = () => ({
  id: "",
  name: "",
  email: "",
  password: "",
  description: "",
  url: "",
  admin_name: "",
  admin_email: "",
  admin_pass: "",
});
const clientForm = reactive(emptyClientForm());
const updateClientForm = ($data = emptyClientForm()) => {
  const setClientForm = (data) => ({
    id: data.id,
    name: data.name,
    email: data.email,
    password: "",
    description: data.description,
    url: data.url,
    admin_name: data.user?.name,
    admin_email: data.user?.email,
    admin_pass: "",
  });
  Object.assign(clientForm, setClientForm($data));
};
const openInfoModal = ($val, $data) => {
  isModalActive.value = $val;
  updateClientForm($data);
};
const openDangerModal = ($val, $data) => {
  isModalDangerActive.value = $val;
  updateClientForm($data);
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiAccount" title="Manage Client" main>
      </SectionTitleLineWithButton>

      <CardBox>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="">
            <BaseButton
              type="submit"
              color="info"
              label="Add Client"
              :icon="mdiPlusCircle"
              @click="openInfoModal(true)"
            />
          </div>

          <ClientForm
            :modal-info-open="isModalActive"
            :modal-danger-open="isModalDangerActive"
            :client-form="clientForm"
            @open-info-modal="openInfoModal"
            @open-danger-modal="openDangerModal"
            @update-client-form="updateClientForm"
          ></ClientForm>
        </div>
        <ClientTable
          @open-info-modal="openInfoModal"
          @open-danger-modal="openDangerModal"
        ></ClientTable>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
