export function useApiBase() {
  const config = useRuntimeConfig()
  return config.public.apiBase
}

export function apiFetch<T>(path: string, opts?: Parameters<typeof $fetch>[1]) {
  const base = useApiBase()
  return $fetch<T>(path, { baseURL: base, ...opts })
}

export function useApi<T>(path: string, opts?: Parameters<typeof useFetch>[1]) {
  const base = useApiBase()
  return useFetch<T>(path, { baseURL: base, ...opts })
}
