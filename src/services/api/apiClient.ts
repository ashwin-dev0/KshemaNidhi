// Backend placeholder.
// When a REST backend is introduced, keep feature services stable and replace repository calls here.
export const apiClient = {
  async get<T>(_path: string): Promise<T> {
    throw new Error('API backend is not configured yet.')
  },
}
