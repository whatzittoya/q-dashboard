<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import {
  Chart,
  BarElement,
  PointElement,
  BarController,
  LinearScale,
  CategoryScale,
  Tooltip
} from 'chart.js'

const props = defineProps({
  items: { type: Object, default: () => ({}) }
})

Chart.register(BarElement, PointElement, BarController, LinearScale, CategoryScale, Tooltip)

const root = ref(null)
const getData = (labels, value) => {
  return {
    labels: labels,
    datasets: [
      {
        label: 'Value',
        data: value,
        backgroundColor: ['rgba(75, 192, 192, 0.2)'],
        borderColor: ['rgb(75, 192, 192)'],
        borderWidth: 1
      }
    ]
  }
}
const groupByCategory = (data) => {
  const groupedData = {}

  // Iterate through the data array
  data.forEach((entry) => {
    const { category_code, revenue, tax } = entry.TransactionLine

    // If the category_code is not in the groupedData, initialize it
    if (!groupedData[category_code]) {
      groupedData[category_code] = { category_code, totalRevenue: 0 }
    }

    // Update the totalRevenue for the current category_code
    groupedData[category_code].totalRevenue += parseFloat(revenue) + parseFloat(tax)
  })

  // Convert the groupedData object to an array of objects
  const result = Object.values(groupedData)

  const labels = []
  const values = []

  // Iterate through the groupedData array
  result.forEach((item) => {
    labels.push(item.category_code)
    values.push(item.totalRevenue)
  })

  return { label: labels, value: values }
}

let chart
onMounted(() => {
  const config = {
    type: 'bar',
    data: chartData.value,
    options: {
      scales: {
        y: {
          title: {
            display: true,
            text: 'Values'
          },
          beginAtZero: true
        },
        x: {
          title: {
            display: true,
            text: 'Categories'
          }
        }
      }
    }
  }
  //var ctx = document.getElementById("myChart");
  chart = new Chart(root.value, config)
})
const chartData = computed(() => {
  console.log(props.items)
  const data = groupByCategory(props.items.data)
  console.log(getData(data.label, data.value))
  return getData(data.label, data.value)
})

watch(chartData, (data) => {
  if (chart) {
    chart.data = data
    chart.update()
  }
})
</script>

<template>
        <canvas ref="root" />
    
</template>
