<script setup>
import { ref, computed, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { mdiMinus, mdiPlus } from "@mdi/js";
import { getButtonColor } from "@/colors.js";
import BaseIcon from "@/components/BaseIcon.vue";
import AsideMenuList from "@/components/AsideMenuList.vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  isDropdownList: Boolean,
});

const emit = defineEmits(["menu-click"]);
const route = useRoute();

const hasColor = computed(() => props.item && props.item.color);

const asideMenuItemActiveStyle = computed(() =>
  hasColor.value ? "" : "aside-menu-item-active font-bold"
);

const isDropdownActive = ref(false);

const componentClass = computed(() => [
  props.isDropdownList ? "py-3 px-6 text-sm" : "py-3",
  hasColor.value
    ? getButtonColor(props.item.color, false, true)
    : `aside-menu-item dark:text-slate-300 dark:hover:text-white`,
]);

const hasDropdown = computed(() => !!props.item.menu);

// Check if any child menu item matches current route
const hasActiveChild = computed(() => {
  if (!hasDropdown.value || !props.item.menu) return false;
  
  return props.item.menu.some(childItem => {
    if (childItem.to) {
      return route.path === childItem.to;
    }
    // Recursively check nested dropdowns
    if (childItem.menu) {
      return childItem.menu.some(nestedItem => route.path === nestedItem.to);
    }
    return false;
  });
});

// Auto-open dropdown if child is active
watch(hasActiveChild, (isActive) => {
  if (isActive && !isDropdownActive.value) {
    isDropdownActive.value = true;
  }
}, { immediate: true });

const menuClick = (event) => {
  emit("menu-click", event, props.item);

  if (hasDropdown.value) {
    isDropdownActive.value = !isDropdownActive.value;
  }
};
</script>

<template>
  <li>
    <component
      :is="item.to ? RouterLink : 'a'"
      v-slot="vSlot"
      :to="item.to ?? null"
      :href="item.href ?? null"
      :target="item.target ?? null"
      class="flex cursor-pointer"
      :class="componentClass"
      @click="menuClick"
    >
      <BaseIcon
        v-if="item.icon"
        :path="item.icon"
        class="flex-none"
        :class="[vSlot && vSlot.isExactActive ? asideMenuItemActiveStyle : '']"
        w="w-16"
        :size="18"
      />
      <span
        class="grow text-ellipsis line-clamp-1"
        :class="[
          { 'pr-12': !hasDropdown },
          vSlot && vSlot.isExactActive ? asideMenuItemActiveStyle : '',
        ]"
        >{{ item.label }}</span
      >
      <BaseIcon
        v-if="hasDropdown"
        :path="isDropdownActive ? mdiMinus : mdiPlus"
        class="flex-none"
        :class="[vSlot && vSlot.isExactActive ? asideMenuItemActiveStyle : '']"
        w="w-12"
      />
    </component>
    <AsideMenuList
      v-if="hasDropdown"
      :menu="item.menu"
      :class="[
        'aside-menu-dropdown',
        isDropdownActive ? 'block dark:bg-slate-800/50' : 'hidden',
      ]"
      is-dropdown-list
    />
  </li>
</template>
