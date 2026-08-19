import { FUND_CONFIG } from '../../config/fund.config'
import type { FundState } from '../../types/fund.types'
import type { StorageAdapter } from './storage'

const emptyState: FundState = { openingFund: 0, loans: [], members: [], contributions: [] }

function normalize(value: Partial<FundState> | null | undefined): FundState {
  return {
    openingFund: Number(value?.openingFund || 0),
    loans: value?.loans || [],
    members: value?.members || [],
    contributions: value?.contributions || [],
  }
}

export const localStorageAdapter: StorageAdapter<FundState> = {
  load() {
    const raw = localStorage.getItem(FUND_CONFIG.storageKey)
    if (raw) {
      try { return normalize(JSON.parse(raw) as Partial<FundState>) } catch { localStorage.removeItem(FUND_CONFIG.storageKey) }
    }

    for (const key of FUND_CONFIG.legacyStorageKeys) {
      const legacy = localStorage.getItem(key)
      if (!legacy) continue
      try { return normalize(JSON.parse(legacy) as Partial<FundState>) } catch { /* ignore invalid legacy payload */ }
    }
    return { ...emptyState }
  },
  save(data) {
    localStorage.setItem(FUND_CONFIG.storageKey, JSON.stringify(data))
  },
  clear() {
    localStorage.removeItem(FUND_CONFIG.storageKey)
    FUND_CONFIG.legacyStorageKeys.forEach((key) => localStorage.removeItem(key))
  },
}
