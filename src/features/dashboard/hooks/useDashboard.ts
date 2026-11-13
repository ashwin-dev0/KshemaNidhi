import { useMemo } from 'react'
import { useFundStore } from '../../../store/fundStore'
import { getDashboardTotals } from '../utils/dashboardCalculations'

export function useDashboard() {
  const { loans, members, contributions } = useFundStore()
  const state = useMemo(() => ({ loans, members, contributions }), [loans, members, contributions])
  const totals = useMemo(() => getDashboardTotals(state), [state])
  return { state, totals }
}
