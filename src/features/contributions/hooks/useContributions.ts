import { useMemo } from 'react'
import { FUND_CONFIG } from '../../../config/fund.config'
import { useFundStore } from '../../../store/fundStore'

export function useContributions(month: string) {
  const store = useFundStore()
  const activeMembers = useMemo(()=>store.members.filter(m=>m.active),[store.members])
  const receivedIds = useMemo(()=>new Set(store.contributions.filter(c=>c.month===month&&c.received).map(c=>c.memberId)),[store.contributions,month])
  const pendingMembers = activeMembers.filter(m=>!receivedIds.has(m.id))
  return {
    activeMembers,
    receivedIds,
    pendingMembers,
    expected: activeMembers.length * FUND_CONFIG.monthlyContribution,
    received: (activeMembers.length-pendingMembers.length) * FUND_CONFIG.monthlyContribution,
    pending: pendingMembers.length * FUND_CONFIG.monthlyContribution,
    toggleContribution: store.toggleContribution,
    markAllContributions: store.markAllContributions,
  }
}
