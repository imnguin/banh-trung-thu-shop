import { callApi } from './axiosClient'
import { HOSTNAME } from '../lib/systemvars'

export const createOrder = (payload) => callApi(HOSTNAME, '/api/mooncake-order/create', payload)

export const getAllOrders = (status) => callApi(HOSTNAME, '/api/mooncake-order/all', { status })

export const getOrdersByPhone = (phone) => callApi(HOSTNAME, '/api/mooncake-order/by-phone', { phone })

export const getOrderByCode = (orderCode) => callApi(HOSTNAME, '/api/mooncake-order/by-code', { orderCode })

export const updateOrderStatus = (_id, status) =>
  callApi(HOSTNAME, '/api/mooncake-order/update-status', { _id, status })
