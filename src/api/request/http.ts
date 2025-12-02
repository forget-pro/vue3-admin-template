import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, } from "axios"

type CacheEntry = {
  timestamp: number
  data: unknown
  expire: number // ms 缓存时长
}

interface CacheAxiosRequestConfig extends AxiosRequestConfig {
  cacheExpire?: number // ms 缓存时间，默认可设置为类的默认缓存时间
}

export class CacheAxios {
  protected axiosInstance: AxiosInstance
  protected cache: Map<string, CacheEntry> = new Map()
  protected defaultCacheExpire: number // ms

  constructor(
    config?: CacheAxiosRequestConfig,
    defaultCacheExpire = 0 // 默认不缓存
  ) {
    this.axiosInstance = axios.create(config)
    this.defaultCacheExpire = defaultCacheExpire

    // 绑定默认拦截器，子类可以覆盖
    this.axiosInstance.interceptors.request.use(this.requestInterceptor.bind(this))
    this.axiosInstance.interceptors.response.use(this.responseInterceptor.bind(this))
  }

  protected getCacheKey(config: AxiosRequestConfig): string {
    const { method, url, params, data } = config
    return JSON.stringify({ method, url, params, data })
  }

  // 请求拦截器示例，默认直接返回 config
  protected requestInterceptor(config: InternalAxiosRequestConfig) {
    // 可在这里做统一的 token 注入、日志等
    return config
  }

  // 响应拦截器示例，默认直接返回 response
  protected responseInterceptor(response: AxiosResponse) {
    if (response.data.code == 0) {
      return response.data.data
    }
  }

  async request<T = unknown>(config: CacheAxiosRequestConfig): Promise<T> {
    const cacheExpire = config.cacheExpire ?? this.defaultCacheExpire
    const cacheKey = this.getCacheKey(config)

    // 检查缓存
    if (cacheExpire > 0 && this.cache.has(cacheKey)) {
      const entry = this.cache.get(cacheKey)!
      const now = Date.now()
      if (now - entry.timestamp < entry.expire) {
        return Promise.resolve(entry.data as T)
      } else {
        this.cache.delete(cacheKey)
      }
    }

    // 发起请求
    const response = await this.axiosInstance.request<T>(config)

    // 缓存响应数据
    if (cacheExpire > 0) {
      this.cache.set(cacheKey, {
        timestamp: Date.now(),
        data: response.data,
        expire: cacheExpire,
      })
    }

    return response as T
  }

  // 快捷方法
  get = <T = unknown>(url: string, config?: CacheAxiosRequestConfig) => {
    return this.request<T>({ ...config, url, method: 'get' })
  }
  post = <T = unknown>(url: string, data?: unknown, config?: CacheAxiosRequestConfig) => {
    return this.request<T>({ ...config, url, data, method: 'post' })
  }
  put = <T = unknown>(url: string, data?: unknown, config?: CacheAxiosRequestConfig) => {
    return this.request<T>({ ...config, url, data, method: 'put' })
  }
  delete = <T = unknown>(url: string, config?: CacheAxiosRequestConfig) => {
    return this.request<T>({ ...config, url, method: 'delete' })
  }

  // 可手动清理缓存
  clearCache() {
    this.cache.clear()
  }
}

export const httpService = new CacheAxios({
  baseURL: 'https://m1.apifoxmock.com/m1/7363296-7094237-default',
  timeout: 10000, // 默认超时时间10秒
})
