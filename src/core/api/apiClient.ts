const BASE_URL = 'https://privateshow.com.br'
const DEFAULT_TENANT = 'BrainrotColoring'

interface RequestOptions {
  params?: Record<string, string | number>
  body?: Record<string, any>
  signal?: AbortSignal
}

interface ApiResponse<T> {
  data: T
  message: string
}

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, body, signal } = options

  const url = new URL(endpoint, BASE_URL)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value))
    }
  }

  const fetchOptions: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
    signal,
  }

  if (body) {
    fetchOptions.body = JSON.stringify(body)
  }

  const res = await fetch(url.toString(), fetchOptions)

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }

  const json: ApiResponse<T> = await res.json()
  return json.data
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>('GET', endpoint, options),

  post: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>('POST', endpoint, options),

  put: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>('PUT', endpoint, options),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>('DELETE', endpoint, options),
}

export { BASE_URL, DEFAULT_TENANT }
