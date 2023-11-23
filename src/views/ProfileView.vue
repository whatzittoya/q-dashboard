<script setup>
import { reactive, ref } from 'vue'
import { useMainStore } from '@/stores/main'
import { mdiAccount, mdiMail, mdiAsterisk, mdiFormTextboxPassword, mdiGithub } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import UserCard from '@/components/UserCard.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { resetPassword } from '@/service/auth'
import NotificationBar from '@/components/NotificationBar.vue'

const notificationBar = ref({ show: false, color: 'success', text: '' })

const passwordForm = reactive({
  password_current: '',
  password: '',
  password_confirmation: ''
})

const submitPass = async () => {
  if (passwordForm.password !== passwordForm.password_confirmation) {
    notificationBar.value.color = 'danger'
    notificationBar.value.text = 'New and confirm password are not matched'
    notificationBar.value.show = true
  } else {
    const resetAction = await resetPassword(
      passwordForm.password_current,
      passwordForm.password_confirmation
    )
    if (resetAction.success) {
      notificationBar.value.color = 'success'
      notificationBar.value.text = 'Password reset successfully'
      notificationBar.value.show = true
    } else {
      notificationBar.value.color = 'danger'
      notificationBar.value.text = resetAction.message
      notificationBar.value.show = true
    }
    console.log(resetAction)
  }
  passwordForm.password_current = ''
  passwordForm.password = ''
  passwordForm.password_confirmation = ''
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <UserCard class="mb-6" />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
  

        <CardBox is-form @submit.prevent="submitPass">
          <NotificationBar v-if="notificationBar.show" :color="notificationBar.color" :icon="mdiContrastCircle" :outline="notificationsOutline">
        {{notificationBar.text}}
        </NotificationBar>
          <FormField label="Current password" help="Required. Your current password">
            <FormControl
              v-model="passwordForm.password_current"
              :icon="mdiAsterisk"
              name="password_current"
              type="password"
              required
              autocomplete="current-password"
            />
          </FormField>

          <BaseDivider />

          <FormField label="New password" help="Required. New password">
            <FormControl
              v-model="passwordForm.password"
              :icon="mdiFormTextboxPassword"
              name="password"
              type="password"
              required
              autocomplete="new-password"
            />
          </FormField>

          <FormField label="Confirm password" help="Required. New password one more time">
            <FormControl
              v-model="passwordForm.password_confirmation"
              :icon="mdiFormTextboxPassword"
              name="password_confirmation"
              type="password"
              required
              autocomplete="new-password"
            />
          </FormField>

          <template #footer>
            <BaseButtons>
              <BaseButton type="submit" color="info" label="Submit" />
              <BaseButton color="info" label="Options" outline />
            </BaseButtons>
          </template>
        </CardBox>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
