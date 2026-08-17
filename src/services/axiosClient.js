import axios from 'axios'

const AUTH_STORAGE_KEY = 'sellerInfo'
const authListeners = new Set()

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setStoredAuth(data) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
  authListeners.forEach((cb) => cb(data))
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  authListeners.forEach((cb) => cb(null))
}

export function subscribeAuthChange(callback) {
  authListeners.add(callback)
  return () => authListeners.delete(callback)
}

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)))
  failedQueue = []
}

const axiosClient = axios.create({
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

const handleRefreshToken = async (originalRequest) => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject })
    }).then((token) => {
      originalRequest.headers.Authorization = `Bearer ${token}`
      return axiosClient(originalRequest)
    })
  }

  isRefreshing = true
  originalRequest._retry = true

  try {
    const baseUrl = originalRequest.baseURL || ''
    const res = await axios.post(`${baseUrl}/api/auth/refresh`, {}, { withCredentials: true })
    const data = res.data.data

    setStoredAuth(data)
    processQueue(null, data.accessToken)
    isRefreshing = false

    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
    return axiosClient(originalRequest)
  } catch (refreshError) {
    processQueue(refreshError, null)
    isRefreshing = false
    clearStoredAuth()
    return Promise.reject(refreshError)
  }
}

axiosClient.interceptors.request.use((config) => {
  const auth = getStoredAuth()
  if (auth?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

axiosClient.interceptors.response.use(
  (response) => {
    const originalRequest = response.config
    const messageCode = response.data?.messageCode

    if ((messageCode === 401 || messageCode === 403) && !originalRequest._retry) {
      return handleRefreshToken(originalRequest)
    }

    return response.data
  },
  (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    if ((status === 401 || status === 403) && !originalRequest?._retry) {
      return handleRefreshToken(originalRequest)
    }

    return Promise.reject(error)
  },
)

export const callApi = (host, apiPath, params = {}, options = {}, method = 'POST') => {
  return axiosClient({
    baseURL: host,
    url: apiPath,
    method,
    data: params,
    ...options,
  })
}

export default axiosClient
