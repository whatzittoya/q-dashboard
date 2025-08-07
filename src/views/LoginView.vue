<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { mdiAccount, mdiAsterisk } from "@mdi/js";
import SectionFullScreen from "@/components/SectionFullScreen.vue";
import CardBox from "@/components/CardBox.vue";
import FormCheckRadio from "@/components/FormCheckRadio.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import { login } from "@/service/auth";
import NotificationBar from "@/components/NotificationBar.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";
import { useMainStore } from "@/stores/main";
import axios from "axios";

const form = reactive({
  login: "",
  pass: "",
  remember: true,
});
const failedLogin = ref(false);
const router = useRouter();
const mainStore = useMainStore();
const client = ref(0);
const selectClient = computed(() => {
  const st = mainStore.apiData.client.data.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  return st;
});
const menuStore = ref(false);
const submit = async () => {
  const postLogin = await login(form.login, form.pass);
  if (postLogin.success) {
    failedLogin.value = false;
    // console.log(postLogin);
    if (postLogin.role == "super-admin") {
      await mainStore.fetchClient();

      menuStore.value = true;
    } else {
      await mainStore.setUser();
      await mainStore.fetchStore();

      if (form.login.includes("expat")) {
        router.push("/daily-transaction");
      } else {
        router.push("/dashboard-consolidate");
      }
    }
  } else {
    failedLogin.value = true;
  }
};
const changeClientAdmin = () => {
  const client_id = client.value.value;
  // console.log(client_id);
  const url = `${import.meta.env.VITE_API_URL}/super_admin/change-client`;
  axios({
    method: "POST",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    url: url,
    data: {
      client_id,
    },
  })
    .then(async (response) => {
      await mainStore.setUser();
      await mainStore.fetchStore();
      router.push("/dashboard-consolidate");
    })
    .catch(() => {});
};
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBoxModal
        v-model="menuStore"
        title="Select Login as Client"
        @confirm="changeClientAdmin"
      >
        <FormField label="Client" help="Select Client">
          <FormControl v-model="client" :options="selectClient" />
        </FormField>
      </CardBoxModal>

      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <NotificationBar
          v-if="failedLogin"
          color="danger"
          :icon="mdiContrastCircle"
          :outline="notificationsOutline"
        >
          <b>Failed Login</b> Incorrect Username/Password
        </NotificationBar>
        <FormField label="Login" help="Please enter your login">
          <FormControl
            v-model="form.login"
            :icon="mdiAccount"
            name="login"
            autocomplete="username"
          />
        </FormField>

        <FormField label="Password" help="Please enter your password">
          <FormControl
            v-model="form.pass"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
          />
        </FormField>

        <FormCheckRadio
          v-model="form.remember"
          name="remember"
          label="Remember"
          :input-value="true"
        />

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Login" />
            <BaseButton to="/dashboard" color="info" outline label="Back" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
