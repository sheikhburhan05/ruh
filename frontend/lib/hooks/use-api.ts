import { useAuth0 } from "@auth0/auth0-react"
import axios, { AxiosRequestConfig } from "axios"
import { useCallback } from "react"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BE_URL || "http://localhost:8000",
})

export function useApi() {
  const { getIdTokenClaims } = useAuth0()

  const authRequest = useCallback(async <T>(
    config: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const token = await getIdTokenClaims();

      const response = await api.request({
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token?.__raw || ''}`,
        },
      })

      return response.data
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }, [getIdTokenClaims])

  const get = useCallback(<T>(url: string, config: AxiosRequestConfig = {}) => {
    return authRequest<T>({ ...config, method: "GET", url })
  }, [authRequest])

  const post = useCallback(<T>(url: string, data?: any, config: AxiosRequestConfig = {}) => {
    return authRequest<T>({ ...config, method: "POST", url, data })
  }, [authRequest])

  const put = useCallback(<T>(url: string, data?: any, config: AxiosRequestConfig = {}) => {
    return authRequest<T>({ ...config, method: "PUT", url, data })
  }, [authRequest])

  const del = useCallback(<T>(url: string, config: AxiosRequestConfig = {}) => {
    return authRequest<T>({ ...config, method: "DELETE", url })
  }, [authRequest])

  return {
    get,
    post,
    put,
    delete: del,
  }
} 