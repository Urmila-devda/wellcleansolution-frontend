import axios from "axios"
import { API_BASE_URL } from "../config"

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
})

let authToken = null

export const setAuthToken = (token) => {
  authToken = token
}

// Inject bearer token on every request if it exists in local storage
API.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => API.post("/auth/login", credentials),
  register: (userData) => API.post("/auth/register", userData),
  getProfile: () => API.get("/auth/me"),
}

export const productsAPI = {
  getAll: (params) => API.get("/products", { params }),
  getOne: (id) => API.get(`/products/${id}`),
  create: (data) => API.post("/products", data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`),
  uploadImages: (formData) => API.post("/products/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),
}

export const cartAPI = {
  get: () => API.get("/cart"),
  sync: (items) => API.post("/cart", { items }),
  clear: () => API.delete("/cart"),
}

export const ordersAPI = {
  place: (data) => API.post("/orders", data),
  getMyOrders: () => API.get("/orders/my-orders"),
  getOne: (id) => API.get(`/orders/${id}`),
  getAllAdmin: () => API.get("/orders"),
  updateStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
}

export const paymentAPI = {
  createOrder: (amount) => API.post("/payment/create-order", { amount }),
  verifyPayment: (data) => API.post("/payment/verify-payment", data),
}

export const enquiriesAPI = {
  submit: (data) => API.post("/enquiries", data),
  getAll: (params) => API.get("/enquiries", { params }),
  updateStatus: (id, status) => API.put(`/enquiries/${id}/status`, { status }),
}

export const returnsAPI = {
  submit: (formData) => API.post("/return-requests", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),
  getMyRequests: () => API.get("/return-requests/my-requests"),
  getAllAdmin: () => API.get("/return-requests"),
  updateStatus: (id, status, rejectionReason) => API.put(`/return-requests/${id}/status`, { status, rejectionReason }),
}

export default API
