import { callApi, clearStoredAuth, setStoredAuth } from './axiosClient'
import { HOSTNAME } from '../lib/systemvars'

export const login = async (username, otp) => {
  const response = await callApi(HOSTNAME, '/api/auth/login', { username, otp })
  if (!response.isError && response.data?.accessToken) {
    setStoredAuth(response.data)
  }
  return response
}

export const logout = async () => {
  const response = await callApi(HOSTNAME, '/api/auth/logout')
  clearStoredAuth()
  return response
}
