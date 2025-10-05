<script setup>
import { ref, computed, watch } from "vue";
import { mdiClose, mdiUpload, mdiDownload, mdiFileExcel } from "@mdi/js";
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

const emit = defineEmits(["update:modelValue", "import", "cancel"]);

const fileInput = ref(null);
const selectedFile = ref(null);
const parsedData = ref([]);
const isUploading = ref(false);
const isProcessing = ref(false);
const processingStep = ref("");
const validationErrors = ref([]);
const detectedDelimiter = ref("");

const value = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

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
  selectedFile.value = null;
  parsedData.value = [];
  validationErrors.value = [];
  processingStep.value = "";
  detectedDelimiter.value = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// Generate CSV template
const downloadTemplate = () => {
  const headers = [
    "item_id",
    "item_name",
    ...props.warehouses.flatMap(warehouse => [
      `${warehouse.name}-min`,
      `${warehouse.name}-max`
    ])
  ];

  // Create sample data row
  const sampleRow = [
    "ITEM001",
    "Sample Product",
    ...props.warehouses.flatMap(() => ["10", "100"])
  ];

  const csvContent = [
    headers.join(","),
    sampleRow.join(",")
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "stock_levels_template.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Handle file selection
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      alert("Please select a CSV file (.csv)");
      return;
    }
    selectedFile.value = file;
    parseCSV(file);
  }
};

// Parse CSV file
const parseCSV = (file) => {
  isProcessing.value = true;
  processingStep.value = "Reading CSV file...";
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const csvText = e.target.result;
      const lines = csvText.split("\n").filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error("CSV file must have at least a header row and one data row");
      }

      processingStep.value = "Detecting delimiter...";
      
      // Detect delimiter (comma or semicolon)
      const firstLine = lines[0];
      const commaCount = (firstLine.match(/,/g) || []).length;
      const semicolonCount = (firstLine.match(/;/g) || []).length;
      const delimiter = semicolonCount > commaCount ? ";" : ",";
      detectedDelimiter.value = delimiter;
      
      processingStep.value = "Parsing CSV data...";
      
      // Parse header
      const headers = lines[0].split(delimiter).map(h => h.trim().replace(/"/g, ""));
      
      // Validate headers
      const expectedHeaders = [
        "item_id",
        "item_name",
        ...props.warehouses.flatMap(warehouse => [
          `${warehouse.name}-min`,
          `${warehouse.name}-max`
        ])
      ];
      
      const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`);
      }

      processingStep.value = "Processing data rows...";
      
      // Parse data rows
      const data = [];
      const errors = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(delimiter).map(v => v.trim().replace(/"/g, ""));
        
        if (values.length !== headers.length) {
          errors.push(`Row ${i + 1}: Column count mismatch`);
          continue;
        }

        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });

        // Validate required fields
        if (!row.item_id || !row.item_name) {
          errors.push(`Row ${i + 1}: Missing item_id or item_name`);
          continue;
        }

        // Process warehouse data
        const warehouseData = [];
        props.warehouses.forEach(warehouse => {
          const minHeader = `${warehouse.name}-min`;
          const maxHeader = `${warehouse.name}-max`;
          
          const minValue = parseInt(row[minHeader]) || 0;
          const maxValue = parseInt(row[maxHeader]) || 0;
          
          if (minValue > 0 || maxValue > 0) {
            warehouseData.push({
              item_id: row.item_id,
              name: row.item_name,
              minimum: minValue,
              maximum: maxValue,
              warehouse_name: warehouse.name,
            });
          }
        });

        if (warehouseData.length > 0) {
          data.push(...warehouseData);
        } else {
          errors.push(`Row ${i + 1}: No stock levels defined for any warehouse`);
        }
      }

      parsedData.value = data;
      validationErrors.value = errors;
      
      processingStep.value = "";
      isProcessing.value = false;
      
    } catch (error) {
      console.error("CSV parsing error:", error);
      alert(`Error parsing CSV: ${error.message}`);
      isProcessing.value = false;
      processingStep.value = "";
    }
  };
  
  reader.readAsText(file);
};

// Handle import
const handleImport = async () => {
  if (parsedData.value.length === 0) {
    alert("No valid data to import");
    return;
  }

  isUploading.value = true;
  try {
    emit("import", parsedData.value);
  } finally {
    isUploading.value = false;
  }
};

// Handle cancel
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
      <CardBoxComponentTitle title="Import Stock Levels from CSV">
        <BaseButton
          :icon="mdiClose"
          color="whiteDark"
          small
          rounded-full
          @click.prevent="handleCancel"
        />
      </CardBoxComponentTitle>

      <div class="space-y-6">
        <!-- Template Download -->
        <div class="bg-blue-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-blue-900 mb-3">Step 1: Download Template</h3>
          <p class="text-sm text-blue-700 mb-3">
            Download the CSV template to see the required format and structure. 
            The system supports both comma (,) and semicolon (;) delimited files.
          </p>
          <BaseButton
            :icon="mdiDownload"
            label="Download CSV Template"
            color="info"
            outline
            @click="downloadTemplate"
          />
        </div>

        <!-- File Upload -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-900">Step 2: Upload CSV File</h3>
          
          <FormField label="Select CSV File" help="Choose a CSV file with stock level data (comma or semicolon delimited)">
            <FormControl
              ref="fileInput"
              type="file"
              accept=".csv"
              @change="handleFileSelect"
              :disabled="isProcessing"
            />
          </FormField>

          <!-- File Info -->
          <div v-if="selectedFile" class="bg-gray-50 p-3 rounded-lg">
            <div class="flex items-center space-x-2">
              <BaseIcon :path="mdiFileExcel" class="text-green-600" size="20" />
              <span class="text-sm font-medium text-gray-900">{{ selectedFile.name }}</span>
              <span class="text-xs text-gray-500">({{ (selectedFile.size / 1024).toFixed(1) }} KB)</span>
            </div>
            <div v-if="detectedDelimiter" class="mt-2 text-xs text-blue-600">
              Detected delimiter: <span class="font-medium">{{ detectedDelimiter === ',' ? 'comma (,)' : 'semicolon (;)' }}</span>
            </div>
          </div>

          <!-- Processing Status -->
          <div v-if="isProcessing" class="bg-yellow-50 p-3 rounded-lg">
            <div class="flex items-center space-x-2">
              <div class="animate-spin h-4 w-4 border-2 border-yellow-500 rounded-full border-t-transparent"></div>
              <span class="text-sm text-yellow-700">{{ processingStep }}</span>
            </div>
          </div>
        </div>

        <!-- Validation Results -->
        <div v-if="parsedData.length > 0 || validationErrors.length > 0" class="space-y-4">
          <h3 class="text-sm font-medium text-gray-900">Step 3: Validation Results</h3>

          <!-- Success Summary -->
          <div v-if="parsedData.length > 0" class="bg-green-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-green-900 mb-2">✅ Data Ready for Import</h4>
            <div class="text-sm text-green-700">
              <p>Found <span class="font-medium">{{ parsedData.length }}</span> stock level records to import</p>
              <p>Covering <span class="font-medium">{{ new Set(parsedData.map(d => d.item_id)).size }}</span> unique items</p>
            </div>
          </div>

          <!-- Validation Errors -->
          <div v-if="validationErrors.length > 0" class="bg-red-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-red-900 mb-2">⚠️ Validation Errors</h4>
            <ul class="text-sm text-red-700 space-y-1">
              <li v-for="error in validationErrors" :key="error" class="flex items-start">
                <span class="mr-2">•</span>
                <span>{{ error }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Import Preview -->
        <div v-if="parsedData.length > 0" class="space-y-4">
          <h3 class="text-sm font-medium text-gray-900">Import Preview</h3>
          <div class="bg-white border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item ID</th>
                  <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
                  <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
                  <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Min</th>
                  <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Max</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, index) in parsedData.slice(0, 10)" :key="index" class="text-xs">
                  <td class="px-3 py-2 text-gray-900">{{ item.item_id }}</td>
                  <td class="px-3 py-2 text-gray-900">{{ item.name }}</td>
                  <td class="px-3 py-2 text-gray-900">{{ item.warehouse_name }}</td>
                  <td class="px-3 py-2 text-gray-900">{{ item.minimum }}</td>
                  <td class="px-3 py-2 text-gray-900">{{ item.maximum }}</td>
                </tr>
                <tr v-if="parsedData.length > 10">
                  <td :colspan="5" class="px-3 py-2 text-center text-xs text-gray-500">
                    ... and {{ parsedData.length - 10 }} more records
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <template #footer>
        <BaseButtons>
          <BaseButton
            :icon="mdiUpload"
            label="Import Data"
            color="info"
            :loading="isUploading"
            :disabled="parsedData.length === 0"
            @click="handleImport"
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

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
