export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message) }
}
async function request<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  let response: Response
  try {
    response = await fetch(`/api${path}`, { method, credentials: 'same-origin', signal: AbortSignal.timeout(15000), headers: body === undefined ? undefined : { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) })
  } catch { throw new ApiError('Cannot reach the server. Check your connection and try again.', 0) }
  if (!response.ok) {
    const data = await response.json().catch(() => null)
    if (response.status === 401 && path !== '/auth/login' && path !== '/auth/me') window.dispatchEvent(new Event('auth-expired'))
    throw new ApiError(typeof data?.detail === 'string' ? data.detail : `Request failed (${response.status}). Please check your input and try again.`, response.status)
  }
  return response.json() as Promise<T>
}
export const apiClient = {
  get: <T,>(path: string) => request<T>(path),
  post: <T,>(path: string, body?: unknown) => request<T>(path, 'POST', body),
  put: <T,>(path: string, body: unknown) => request<T>(path, 'PUT', body),
  delete: <T,>(path: string) => request<T>(path, 'DELETE'),
}
