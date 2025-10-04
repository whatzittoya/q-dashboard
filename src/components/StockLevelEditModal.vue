<script setup>
import { ref, computed, watch } from "vue";
import { mdiClose, mdiContentSave } from "@mdi/js";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import CardBox from "@/components/CardBox.vue";
import OverlayLayer from "@/components/OverlayLayer.vue";
import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object,
    default: () => ({}),
  },
  warehouse: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "save", "cancel"]);

const minimum = ref(0);
const maximum = ref(0);
const isLoading = ref(false);

const value = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

const currentStockData = computed(() => {
  if (props.item && props.warehouse) {
    return props.item[props.warehouse] || { minimum: 0, maximum: 0 };
  }
  return { minimum: 0, maximum: 0 };
});

// Watch for changes in props and update form values
watch(
  () => [props.item, props.warehouse],
  () => {
    if (props.item && props.warehouse) {
      const stockData = currentStockData.value;
      minimum.value = stockData.minimum || 0;
      maximum.value = stockData.maximum || 0;
    }
  },
  { immediate: true }
);

const handleSave = async () => {
  isLoading.value = true;
  try {
    emit("save", {
      item: props.item,
      warehouse: props.warehouse,
      minimum: minimum.value,
      maximum: maximum.value,
    });
  } finally {
    isLoading.value = false;
  }
};

const handleCancel = () => {
  // Reset form values
  minimum.value = currentStockData.value.minimum || 0;
  maximum.value = currentStockData.value.maximum || 0;
  emit("cancel");
  value.value = false;
};

// Handle ESC key
const handleKeydown = (e) => {
  if (e.key === "Escape") {
    handleCancel();
  }
};

// Add event listener when modal opens
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeydown);
    } else {
      document.removeEventListener("keydown", handleKeydown);
    }
  }
);
</script>

<template>
  <OverlayLayer v-show="value" @overlay-click="handleCancel">
    <CardBox
      v-show="value"
      class="shadow-lg max-h-modal w-11/12 md:w-2/5 lg:w-1/3 xl:w-1/4 z-50"
      is-modal
      is-form
    >
      <CardBoxComponentTitle :title="`Edit Stock Level - ${warehouse}`">
        <BaseButton
          :icon="mdiClose"
          color="whiteDark"
          small
          rounded-full
          @click.prevent="handleCancel"
        />
      </CardBoxComponentTitle>

      <div class="space-y-6">
        <!-- Item Info -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-900 mb-2">Item Information</h3>
          <div class="space-y-1">
            <p class="text-sm text-gray-600">
              <span class="font-medium">ID:</span> {{ item.item_id }}
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Name:</span> {{ item.name }}
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Warehouse:</span> {{ warehouse }}
            </p>
          </div>
        </div>

        <!-- Stock Level Inputs -->
        <div class="space-y-4">
          <FormField label="Minimum Stock Level" help="Set the minimum stock level for this item">
            <FormControl
              v-model="minimum"
              type="number"
              min="0"
              step="1"
              placeholder="Enter minimum stock level"
              :disabled="isLoading"
            />
          </FormField>

          <FormField label="Maximum Stock Level" help="Set the maximum stock level for this item">
            <FormControl
              v-model="maximum"
              type="number"
              min="0"
              step="1"
              placeholder="Enter maximum stock level"
              :disabled="isLoading"
            />
          </FormField>
        </div>

        <!-- Current Values Display -->
        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="text-sm font-medium text-blue-900 mb-2">Current Values</h4>
          <div class="flex space-x-4">
            <div class="flex items-center space-x-2">
              <span class="text-xs text-blue-600">Min:</span>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                {{ currentStockData.minimum || 0 }}
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-xs text-blue-600">Max:</span>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                {{ currentStockData.maximum || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <BaseButtons>
          <BaseButton
            :icon="mdiContentSave"
            label="Save Changes"
            color="info"
            :loading="isLoading"
            @click="handleSave"
          />
          <BaseButton
            label="Cancel"
            color="info"
            outline
            @click="handleCancel"
          />
        </BaseButtons>
      </template>
    </CardBox>
  </OverlayLayer>
</template>

<style scoped>
.max-h-modal {
  max-height: 90vh;
  overflow-y: auto;
}
</style>
