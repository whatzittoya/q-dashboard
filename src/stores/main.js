import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useMainStore = defineStore('main', () => {
  const userName = ref()
  const userEmail = ref()
  const apiToken = ref()

  const userAvatar = computed(() => {
    let uemail = userEmail.value
    if (!userEmail.value) {
      uemail = ''
    }
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${uemail.replace(/[^a-z0-9]+/gi, '-')}`
  })

  const isFieldFocusRegistered = ref(false)

  const clients = ref([])
  const history = ref([])
  const apiData = ref({
    store: { data: [], isLoading: false },
    transaction_daily: { data: [], isLoading: false },
    transaction_monthly: { data: [], isLoading: false },
    member: { data: [], isLoading: false },
    summary_sales: { data: [], isLoading: false },
    payment_summary: { data: [], isLoading: false },
    discount_summary: { data: [], isLoading: false },
    no_sales: { data: [], isLoading: false },
    item_sales: { data: [], isLoading: false }
  })

  function setUser() {
    userName.value = localStorage.getItem('email')
    userEmail.value = localStorage.getItem('email')
    apiToken.value = localStorage.getItem('token')
  }

  function fetchSampleClients() {
    console.log(import.meta.env.VITE_API_URL)

    axios
      .get(`data-sources/clients.json?v=3`)
      .then((result) => {
        clients.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function fetchSampleHistory() {
    axios
      .get(`data-sources/history.json`)
      .then((result) => {
        history.value = result?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function fetchQuinosTransaction(date1, date2, store) {
    axiosRequest(`transaction/daily/${date1}/${date2}/${store}`, 'transaction_daily')
  }

  function fetchQuinosStore() {
    axiosRequest('transaction/store', 'store')
  }
  function fetchQuinosTransactionMonthly(store) {
    axiosRequest(`transaction/monthly/${store}`, 'transaction_monthly')
  }

  function fetchMember() {
    axiosRequest(`get-member`, 'member')
  }

  function fetchSummarySales(date1, date2, store) {
    axiosRequest(`report/summary-sales/${date1}/${date2}/${store}`, 'summary_sales')
  }

  function fetchPaymentSummary(date1, date2, store) {
    axiosRequest(`report/payment-summary/${date1}/${date2}/${store}`, 'payment_summary')
  }
  function fetchDiscountSummary(date1, date2, store) {
    axiosRequest(`report/discount-summary/${date1}/${date2}/${store}`, 'discount_summary')
  }
  function fetchNoSales(date1, date2, store) {
    axiosRequest(`report/no-sales/${date1}/${date2}/${store}`, 'no_sales')
  }

  function fetchItemSales(date1, date2, store) {
    axiosRequest(`report/item-sales/${date1}/${date2}/${store}`, 'item_sales')
  }
  function axiosRequest(url, state) {
    apiData.value[state].data = []
    apiData.value[state].isLoading = true
    axios({
      method: 'GET',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      url: `${import.meta.env.VITE_API_URL}/${url}`
    })
      .then((result) => {
        apiData.value[state].data = result?.data
        apiData.value[state].isLoading = false
      })
      .catch((error) => {
        alert(error.message)
      })
  }
  return {
    userName,
    userEmail,
    userAvatar,
    isFieldFocusRegistered,
    clients,
    history,
    setUser,
    fetchSampleClients,
    fetchSampleHistory,
    fetchQuinosTransaction,
    apiData,
    fetchQuinosStore,
    fetchQuinosTransactionMonthly,
    fetchMember,
    fetchSummarySales,
    fetchPaymentSummary,
    fetchDiscountSummary,
    fetchItemSales,
    fetchNoSales
  }
})
