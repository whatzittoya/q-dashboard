<script setup>
import { ref, computed, watch } from "vue";
import { mdiClose, mdiContentSave, mdiPlus } from "@mdi/js";
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
  warehouses: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "save", "cancel"]);

const itemId = ref("");
const itemName = ref("");
const warehouseData = ref([]);
const isLoading = ref(false);

const value = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

// Initialize warehouse data when warehouses prop changes
watch(
  () => props.warehouses,
  (newWarehouses) => {
    if (newWarehouses && newWarehouses.length > 0) {
      warehouseData.value = newWarehouses.map((warehouse) => ({
        warehouse_id: warehouse.id,
        warehouse_name: warehouse.name,
        minimum: 0,
        maximum: 0,
      }));
    }
  },
  { immediate: true }
);

// Watch for modal opening to reset form
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      resetForm();
    }
  }
);

const resetForm = () => {
  itemId.value = "";
  itemName.value = "";
  warehouseData.value = props.warehouses.map((warehouse) => ({
    warehouse_id: warehouse.id,
    warehouse_name: warehouse.name,
    minimum: 0,
    maximum: 0,
  }));
};

const handleSave = async () => {
  if (!itemId.value || !itemName.value) {
    alert("Please fill in Item ID and Item Name");
    return;
  }

  isLoading.value = true;
  try {
    const bulkData = warehouseData.value
      .filter((warehouse) => warehouse.minimum > 0 || warehouse.maximum > 0)
      .map((warehouse) => ({
        item_id: itemId.value,
        name: itemName.value,
        minimum: warehouse.minimum,
        maximum: warehouse.maximum,
        warehouse_name: warehouse.warehouse_name,
      }));

    if (bulkData.length === 0) {
      alert("Please set at least one minimum or maximum value for any warehouse");
      return;
    }

    emit("save", bulkData);
  } finally {
    isLoading.value = false;
  }
};

const handleCancel = () => {
  resetForm();
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
      class="shadow-lg max-h-modal w-11/12 md:w-4/5 lg:w-3/5 xl:w-2/3 z-50"
      is-modal
      is-form
    >
      <CardBoxComponentTitle title="Bulk Insert Stock Levels">
        <BaseButton
          :icon="mdiClose"
          color="whiteDark"
          small
          rounded-full
          @click.prevent="handleCancel"
        />
      </CardBoxComponentTitle>

      <div class="space-y-6">
        <!-- Item Information -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-900 mb-4">Item Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Item ID" help="Enter the item identifier" required>
              <FormControl
                v-model="itemId"
                type="text"
                placeholder="Enter item ID"
                :disabled="isLoading"
              />
            </FormField>

            <FormField label="Item Name" help="Enter the item name" required>
              <FormControl
                v-model="itemName"
                type="text"
                placeholder="Enter item name"
                :disabled="isLoading"
              />
            </FormField>
          </div>
        </div>

        <!-- Warehouse Stock Levels -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-900">Warehouse Stock Levels</h3>
            <span class="text-xs text-gray-500">
              Set minimum and maximum stock levels for each warehouse
            </span>
          </div>

          <div class="space-y-3 max-h-96 overflow-y-auto">
            <div
              v-for="(warehouse, index) in warehouseData"
              :key="warehouse.warehouse_id"
              class="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-sm font-medium text-gray-900">
                  {{ warehouse.warehouse_name }}
                </h4>
                <span class="text-xs text-gray-500">ID: {{ warehouse.warehouse_id }}</span>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <FormField label="Minimum" help="Minimum stock level">
                  <FormControl
                    v-model="warehouse.minimum"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    :disabled="isLoading"
                  />
                </FormField>

                <FormField label="Maximum" help="Maximum stock level">
                  <FormControl
                    v-model="warehouse.maximum"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    :disabled="isLoading"
                  />
                </FormField>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="text-sm font-medium text-blue-900 mb-2">Summary</h4>
          <div class="text-sm text-blue-700">
            <p>
              Item: <span class="font-medium">{{ itemId || 'Not specified' }}</span> - 
              <span class="font-medium">{{ itemName || 'Not specified' }}</span>
            </p>
            <p>
              Warehouses configured: 
              <span class="font-medium">
                {{ warehouseData.filter(w => w.minimum > 0 || w.maximum > 0).length }} / {{ warehouseData.length }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <BaseButtons>
          <BaseButton
            :icon="mdiContentSave"
            label="Bulk Insert"
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
