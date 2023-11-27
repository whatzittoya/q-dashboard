<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  numCol: {
    type: Number,
    default: 0
  },
  row: {
    type: Number,
    default: 20
  }
})
</script>
<template>
  <tr v-for="i in parseInt(props.row)" :key="i">
    <td v-for="j in parseInt(props.numCol)" :key="j">
        <div class="h-4 bg-gray-200 rounded-sm dark:bg-gray-700 mb-4"></div>
    </td>
  </tr>
</template>



<style>
</style>