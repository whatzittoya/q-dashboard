import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

export const useMainStore = defineStore("main", () => {
  const userName = ref();
  const user = ref({ name: "", email: "", role: "" });
  const userEmail = ref();
  const apiToken = ref();
  const date_start = ref();
  const date_end = ref();
  const date_month = ref();
  const date_year = ref();
  const current_store = ref();

  const userAvatar = computed(() => {
    let uemail = userEmail.value;
    if (!userEmail.value) {
      uemail = "";
    }
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${uemail.replace(
      /[^a-z0-9]+/gi,
      "-"
    )}`;
  });

  const isFieldFocusRegistered = ref(false);

  const clients = ref([]);
  const history = ref([]);
  const apiData = ref({
    store: { data: [], isLoading: false },
    warehouse: { data: [], isLoading: false },
    transaction_daily: { data: [], isLoading: false },
    transaction_monthly: { data: [], isLoading: false },
    member: { data: [], isLoading: false },
    summary_sales: { data: [], isLoading: false },
    payment_summary: { data: [], isLoading: false },
    discount_summary: { data: [], isLoading: false },
    no_sales: { data: [], isLoading: false },
    item_sales: { data: [], isLoading: false },
    sales_type: { data: [], isLoading: false },
    consolidate_dashboard: { data: [], isLoading: false },
    client: { data: [], isLoading: false },
    store_admin: { data: [], isLoading: false },
    daily_transaction: { data: [], isLoading: false },
    stock_movement: { data: [], isLoading: false },
    available_dates: { data: [], isLoading: false },
    latest_date: { data: [], isLoading: false },
    stock_minimum: { data: [], isLoading: false },
    purchase_orders: { data: [], isLoading: false },
  });

  function setUser() {
    apiToken.value = localStorage.getItem("token");
    axios({
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      url: `${import.meta.env.VITE_API_URL}/user`,
    })
      .then((result) => {
        const data = result?.data;
        user.value.name = data.name;
        user.value.email = data.email;
        user.value.role = data.role;
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
      });
  }

  function fetchSampleClients() {
    axios
      .get(`data-sources/clients.json?v=3`)
      .then((result) => {
        clients.value = result?.data?.data;
      })
      .catch(() => {
        // alert(error.message)
      });
  }

  function fetchSampleHistory() {
    axios
      .get(`data-sources/history.json`)
      .then((result) => {
        history.value = result?.data;
      })
      .catch(() => {
        // alert(error.message)
      });
  }

  function fetchQuinosTransaction(date1, date2, store) {
    axiosRequest(`transaction/daily/${date1}/${date2}/${store}`, "transaction_daily");
    date_start.value = date1;
    date_end.value = date2;
  }

  function fetchStockMovement(date, refresh = false) {
    const url = refresh
      ? `warehouse/stock-movement/${date}?refresh=true`
      : `warehouse/stock-movement/${date}`;
    axiosRequest(url, "stock_movement");
  }

  function fetchPurchaseOrders() {
    axiosRequest("warehouse/purchase-orders", "purchase_orders");
  }

  function updatePurchaseOrders(date, poIds) {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        url: `${import.meta.env.VITE_API_URL}/warehouse/po`,
        data: {
          stock_date: date,
          po_ids: poIds.map((po) => po.po_id),
        },
      })
        .then((result) => {
          resolve(result.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function updateNeedToOrder(date, itemId, needToOrderValue) {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        url: `${import.meta.env.VITE_API_URL}/warehouse/need-to-order`,
        data: {
          date: date,
          item_code: itemId,
          need_to_order: needToOrderValue,
        },
      })
        .then((result) => {
          resolve(result.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function fetchAvailableDates(warehouseId = null) {
    const url = warehouseId
      ? `stock-level/available-dates/${warehouseId}`
      : "stock-level/available-dates";
    axiosRequest(url, "available_dates");
  }

  function fetchLatestDate(warehouseId = null) {
    const url = warehouseId
      ? `stock-level/latest-date/${warehouseId}`
      : "stock-level/latest-date";
    axiosRequest(url, "latest_date");
  }

  function fetchQuinosStore() {
    axiosRequest("client/store", "store");
    // axiosRequest('transaction/store', 'store')
  }

  function fetchQuinosStoreAdmin($client_id) {
    axiosRequest("client/store/admin/" + $client_id, "store");
    // axiosRequest('transaction/store', 'store')
  }

  function fetchQuinosTransactionMonthly(store) {
    axiosRequest(`transaction/monthly/${store}`, "transaction_monthly");
  }

  function fetchMember() {
    axiosRequest(`get-member`, "member");
  }

  function fetchClient() {
    axiosRequest(`client`, "client");
  }
  function fetchStore() {
    axiosRequest("transaction/store", "store");
  }

  function fetchWarehouse() {
    axiosRequest("warehouse/list", "warehouse");
  }

  function syncWarehouses() {
    return new Promise((resolve, reject) => {
      axios({
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        url: `${import.meta.env.VITE_API_URL}/stock-level/sync-warehouses`,
      })
        .then((result) => {
          resolve(result.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // Stock Minimum API functions
  function createStockMinimum(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        url: `${import.meta.env.VITE_API_URL}/stock-minimum/`,
        data: data,
      })
        .then((result) => {
          resolve(result.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function updateStockMinimum(id, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        url: `${import.meta.env.VITE_API_URL}/stock-minimum/${id}`,
        data: data,
      })
        .then((result) => {
          resolve(result.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function deleteStockMinimum(id) {
    return new Promise((resolve, reject) => {
      axios({
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        url: `${import.meta.env.VITE_API_URL}/stock-minimum/${id}`,
      })
        .then((result) => {
          resolve(result.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function bulkUpsertStockMinimum(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        url: `${import.meta.env.VITE_API_URL}/stock-minimum/bulk-upsert`,
        data: { data: data },
      })
        .then((result) => {
          resolve(result.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function fetchStockLevels() {
    axiosRequest(`stock-level/display`, "stock_minimum");
  }

  function syncStockLevels(warehouseId) {
    const url =
      warehouseId === "all" ? "stock-level/sync/all" : `stock-level/sync/${warehouseId}`;

    return new Promise((resolve, reject) => {
      axios({
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        url: `${import.meta.env.VITE_API_URL}/${url}`,
      })
        .then((result) => {
          resolve(result.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function syncStockMovement() {
    return new Promise((resolve, reject) => {
      axios({
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        url: `${import.meta.env.VITE_API_URL}/stock-level/sync-movement`,
      })
        .then((result) => {
          resolve(result.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function clearApiData(name) {
    apiData.value[name] = { data: [], isLoading: false };
  }

  function fetchSummarySales(date1, date2, store) {
    axiosRequest(`report/summary-sales/${date1}/${date2}/${store}`, "summary_sales");
    date_start.value = date1;
    date_end.value = date2;
  }

  function fetchPaymentSummary(date1, date2, store) {
    axiosRequest(`report/payment-summary/${date1}/${date2}/${store}`, "payment_summary");
    date_start.value = date1;
    date_end.value = date2;
  }
  function fetchDiscountSummary(date1, date2, store) {
    axiosRequest(
      `report/discount-summary/${date1}/${date2}/${store}`,
      "discount_summary"
    );
    date_start.value = date1;
    date_end.value = date2;
  }
  function fetchNoSales(date1, date2, store) {
    axiosRequest(`report/no-sales/${date1}/${date2}/${store}`, "no_sales");
    date_start.value = date1;
    date_end.value = date2;
  }

  function fetchItemSales(date1, date2, store) {
    axiosRequest(`report/item-sales/${date1}/${date2}/${store}`, "item_sales");
    date_start.value = date1;
    date_end.value = date2;
  }
  function fetchSalesType(date1, date2, store) {
    axiosRequest(`report/sales-type/${date1}/${date2}/${store}`, "sales_type");
    date_start.value = date1;
    date_end.value = date2;
  }

  function fetchDailyTransaction(date1, date2, store) {
    axiosRequest(`api/daily-transaction/${date1}/${date2}/${store}`, "daily_transaction");
    date_start.value = date1;
    date_end.value = date2;
  }

  function fetchConsolidateDashboard(month, year, store) {
    axiosRequest(`report/consolidate/${month}/${year}/${store}`, "consolidate_dashboard");
    date_month.value = month;
    date_year.value = year;
    current_store.value = store;
  }
  function getStore() {
    try {
      return apiData.value.store.data.filter((item) => {
        if (item.name == current_store.value) {
          return item;
        }
      })[0];
    } catch {
      return {};
    }
  }

  function resetQuinosData() {
    apiData.value = {
      store: { data: [], isLoading: false },
      warehouse: { data: [], isLoading: false },
      transaction_daily: { data: [], isLoading: false },
      transaction_monthly: { data: [], isLoading: false },
      member: { data: [], isLoading: false },
      summary_sales: { data: [], isLoading: false },
      payment_summary: { data: [], isLoading: false },
      discount_summary: { data: [], isLoading: false },
      no_sales: { data: [], isLoading: false },
      item_sales: { data: [], isLoading: false },
      sales_type: { data: [], isLoading: false },
      consolidate_dashboard: { data: [], isLoading: false },
      client: { data: [], isLoading: false },
      store_admin: { data: [], isLoading: false },
      daily_transaction: { data: [], isLoading: false },
      stock_movement: { data: [], isLoading: false },
      available_dates: { data: [], isLoading: false },
      latest_date: { data: [], isLoading: false },
      stock_minimum: { data: [], isLoading: false },
      purchase_orders: { data: [], isLoading: false },
    };
  }
  function axiosRequest(url, state) {
    apiData.value[state].data = [];
    apiData.value[state].isLoading = true;

    axios({
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      url: `${import.meta.env.VITE_API_URL}/${url}`,
    })
      .then((result) => {
        apiData.value[state].data = result?.data;
        apiData.value[state].isLoading = false;
      })
      .catch(() => {
        // alert(error.message)
      });
  }
  return {
    userName,
    userEmail,
    userAvatar,
    isFieldFocusRegistered,
    clients,
    history,
    user,
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
    fetchNoSales,
    fetchSalesType,
    fetchConsolidateDashboard,
    fetchClient,
    fetchQuinosStoreAdmin,
    fetchStore,
    fetchWarehouse,
    clearApiData,
    fetchDailyTransaction,
    fetchStockMovement,
    fetchPurchaseOrders,
    updatePurchaseOrders,
    fetchAvailableDates,
    fetchLatestDate,
    fetchStockLevels,
    syncStockLevels,
    syncStockMovement,
    updateNeedToOrder,
    createStockMinimum,
    updateStockMinimum,
    deleteStockMinimum,
    bulkUpsertStockMinimum,
    date_start,
    date_end,
    date_month,
    date_year,
    current_store,
    resetQuinosData,
    getStore,
    syncWarehouses,
  };
});
