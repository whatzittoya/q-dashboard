//ChildComponent.vue

<script setup>
import { ref, defineExpose } from 'vue'

const name = ref('child component')
const count = ref(1)
const isAdult = ref(false)
const age = ref(17)

const increase = () => {
  count.value = count.value + 1
  isAdult.value = count.value > age.value
}

const decrease = () => {
  if (count.value > 0) count.value = count.value - 1
  isAdult.value = count.value > age.value
}

//age is private
//rest of the properties & methods are public
defineExpose({
  name,
  count,
  isAdult,
  increase,
  decrease
})
</script>

<template>
  <h5>Child To Parent Data passing</h5>
</template>