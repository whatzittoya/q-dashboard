<script setup>
import { computed, ref } from 'vue'
import { useMainStore } from '@/stores/main'
import BaseLevel from '@/components/BaseLevel.vue'
import UserAvatarCurrentUser from '@/components/UserAvatarCurrentUser.vue'
import CardBox from '@/components/CardBox.vue'

const mainStore = useMainStore()

const userName = computed(() => mainStore.user.name)
</script>

<template>
  <CardBox>
    <BaseLevel type="justify-around lg:justify-center">
      <UserAvatarCurrentUser class="lg:mx-12" />
      <div class="space-y-3 text-center md:text-left lg:mx-12">
      
        <h1 class="text-2xl">
          Account <b>{{ userName }}</b
          >!
        </h1>
        <h1>Role <b>Staff</b></h1>
        <h1>Store : <b>Medan Store</b></h1>
     
      </div>
    </BaseLevel>
  </CardBox>
</template>
