<script setup>
import { reactive, ref } from 'vue'
import { useMainStore } from '@/stores/main'
import { mdiAccount, mdiPlusCircle } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'

import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import BaseButton from '@/components/BaseButton.vue'
import MemberForm from '@/components/admin/MemberForm.vue'
import MemberTable from '@/components/admin/MemberTable.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import CardBox from '@/components/CardBox.vue'
const isModalActive = ref(false)
const infoData = ref({})
const MemberFormRef = ref()
const isModalDangerActive = ref(false)
const emptyMemberForm = () => ({
  id: '',
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  location: ''
})
const memberForm = reactive(emptyMemberForm())
const updateMemberForm = ($data = emptyMemberForm()) => {
  const setMemberForm = (data) => ({
    id: data.id,
    name: data.name,
    email: data.email,
    password: '',
    password_confirmation: '',
    location: data.location
  })
  Object.assign(memberForm, setMemberForm($data))
}
const openInfoModal = ($val, $data) => {
  isModalActive.value = $val
  updateMemberForm($data)
}
const openDangerModal = ($val, $data) => {
  isModalDangerActive.value = $val
  updateMemberForm($data)
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiAccount" title="Manage Memmber" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="">
            <BaseButton
              type="submit"
              color="info"
              label="Add Member"
              :icon="mdiPlusCircle"
              @click="openInfoModal(true)"
            />
          </div>

          <MemberForm
            :modal-info-open="isModalActive"
            :modal-danger-open="isModalDangerActive"
            :member-form="memberForm"
            @open-info-modal="openInfoModal"
            @open-danger-modal="openDangerModal"
            @update-member-form="updateMemberForm"
          ></MemberForm>
        </div>
        <MemberTable
          @open-info-modal="openInfoModal"
          @open-danger-modal="openDangerModal"
        ></MemberTable>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
