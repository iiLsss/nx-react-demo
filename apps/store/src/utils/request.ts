import axios, { CreateAxiosDefaults } from 'axios'
import { API_RUL } from '../constants'
const createRequest = (config?: CreateAxiosDefaults) => {
  const instance = axios.create({
    baseURL: API_RUL,
    timeout: 5000,
    ...config,
  })
  // 请求拦截
  instance.interceptors.request.use(
    (config) => {
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  // 相应拦截

  instance.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  return instance
}

export default createRequest()
