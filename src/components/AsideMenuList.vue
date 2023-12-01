<script setup>
import AsideMenuItem from '@/components/AsideMenuItem.vue'
import { useMainStore } from '@/stores/main'

defineProps({
  isDropdownList: Boolean,
  menu: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['menu-click'])
const mainStore = useMainStore()
const menuClick = (event, item) => {
  emit('menu-click', event, item)
}
</script>

<template>
  <ul>
    <AsideMenuItem
      v-for="(item, index) in menu.filter(property => property?.role == mainStore.user.role || !property?.role)"
      :key="index"
      :item="item"
      :is-dropdown-list="isDropdownList"
      @menu-click="menuClick"
    />
  </ul>
</template>
