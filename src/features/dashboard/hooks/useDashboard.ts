import { useMemo } from 'react'
import { useFundStore } from '../../../store/fundStore'
import { getDashboardTotals } from '../utils/dashboardCalculations'

export function useDashboard() {
  const { openingFund, loans, members, contributions } = useFundStore()
  const state = useMemo(() => ({ openingFund, loans, members, contributions }), [openingFund, loans, members, contributions])
  const totals = useMemo(() => getDashboardTotals(state), [state])
  return { state, totals }
}
