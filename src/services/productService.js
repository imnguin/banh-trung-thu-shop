import { callApi } from './axiosClient'
import { HOSTNAME } from '../lib/systemvars'

export const getAllProducts = () => callApi(HOSTNAME, '/api/mooncake-product/all', {})

export const saveProduct = (payload) => callApi(HOSTNAME, '/api/mooncake-product/save', payload)

export const deleteProduct = (_id) => callApi(HOSTNAME, '/api/mooncake-product/delete', { _id })

export const toggleProductStatus = (_id, active) =>
  callApi(HOSTNAME, '/api/mooncake-product/toggle', { _id, active })
