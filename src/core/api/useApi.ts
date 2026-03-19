import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from './apiClient'

interface UseApiOptions {
  params?: Record<string, string | number>
  enabled?: boolean
}

interface UseApiResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useApi<T>(
  endpoint: string,
  options: UseApiOptions = {}
): UseApiResult<T> {
  const { params, enabled = true } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const paramsKey = params ? JSON.stringify(params) : ''

  const fetchData = useCallback(async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)

    try {
      const result = await api.get<T>(endpoint, {
        params,
        signal: controller.signal,
      })
      if (!controller.signal.aborted) {
        setData(result)
      }
    } catch (err: any) {
      if (err.name !== 'AbortError' && !controller.signal.aborted) {
        setError(err.message ?? 'Unknown error')
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [endpoint, paramsKey]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!enabled) return

    fetchData()

    return () => {
      abortRef.current?.abort()
    }
  }, [fetchData, enabled])

  return { data, loading, error, refetch: fetchData }
}
