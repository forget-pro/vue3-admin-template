interface HttpUniConfig {
  baseurl: string
  timeout?: number
}

interface RequestConfig extends UniNamespace.RequestOptions {
  cacheTime?: number // 缓存时间(s)
  cacheKey?: string // 缓存键
}

interface Interceptors {
  requestInterceptor: ((config: RequestConfig) => RequestConfig | Promise<RequestConfig>) | null
  responseInterceptor: ((response: UniNamespace.RequestSuccessCallbackResult) => any) | null
  errorInterceptor: ((error: any) => any) | null
}

interface CacheItem {
  data: any
  timestamp: number
  expire?: number // 缓存过期时间(ms)
}
