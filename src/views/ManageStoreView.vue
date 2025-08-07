<script setup>
import { reactive, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { mdiAccount, mdiArrowLeft, mdiPlusCircle } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import CardBox from "@/components/CardBox.vue";
import { useRoute } from "vue-router";
import StoreTable from "@/components/admin/StoreTable.vue";
import StoreForm from "@/components/admin/StoreForm.vue";
import BaseButton from "@/components/BaseButton.vue";
const isModalActive = ref(false);
const isModalDangerActive = ref(false);
const emptyStoreForm = () => ({
  id: "",
  name: "",
  long_name: "",
  description: "",
});

const route = useRoute();
const client = route.params.client;
const id = ref(route.params.store);
const storeForm = reactive(emptyStoreForm());
const updateStoreForm = ($data = emptyStoreForm()) => {
  const setStoreForm = (data) => ({
    id: data.id,
    name: data.name,
    long_name: data.long_name,
    description: data.description,
  });
  Object.assign(storeForm, setStoreForm($data));
};
const openInfoModal = ($val, $data) => {
  isModalActive.value = $val;
  updateStoreForm($data);
};
const openDangerModal = ($val, $data) => {
  isModalDangerActive.value = $val;
  updateStoreForm($data);
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiAccount"
        :title="`Manage Store: ${client}`"
        main
      >
      </SectionTitleLineWithButton>
      <div class="p-4">
        <BaseButton
          class="mt-4"
          color="contrast"
          label="Back to client"
          :icon="mdiArrowLeft"
          @click="$router.push({ name: 'client' })"
        />
      </div>
      <CardBox>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StoreForm
            :modal-info-open="isModalActive"
            :store-form="storeForm"
            :client="client"
            @open-info-modal="openInfoModal"
            @update-store-form="updateStoreForm"
          ></StoreForm>
          <StoreTable :client="client" @open-info-modal="openInfoModal"></StoreTable>
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
