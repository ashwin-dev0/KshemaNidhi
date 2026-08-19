import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { FundState } from '../types/fund.types'
import type { Loan } from '../features/loans/types/loan.types'
import type { Member } from '../features/members/types/member.types'
import { localStorageAdapter } from '../services/storage/localStorageAdapter'
import { loanService } from '../features/loans/services/loanService'
import { contributionService } from '../features/contributions/services/contributionService'
import { memberService } from '../features/members/services/memberService'
import { today } from '../utils/dates'

type FundContextValue = FundState & {
  loaded: boolean
  setOpeningFund: (amount: number) => void
  addLoan: (loan: Loan) => void
  deleteLoan: (loanId: string) => void
  togglePayment: (loanId: string, paymentNumber: number) => void
  addMember: (name: string) => void
  deactivateMember: (memberId: string) => void
  toggleContribution: (member: Member, month: string) => void
  markAllContributions: (members: Member[], month: string) => void
  resetAll: () => void
}

const FundContext = createContext<FundContextValue | null>(null)
const initialState: FundState = { openingFund: 0, loans: [], members: [], contributions: [] }

export function FundProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FundState>(initialState)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setState(localStorageAdapter.load() || initialState)
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) localStorageAdapter.save(state)
  }, [state, loaded])

  const value = useMemo<FundContextValue>(() => ({
    ...state,
    loaded,
    setOpeningFund: (openingFund) => setState((current) => ({ ...current, openingFund })),
    addLoan: (loan) => setState((current) => ({ ...current, loans: loanService.create(current.loans, loan) })),
    deleteLoan: (loanId) => setState((current) => ({ ...current, loans: loanService.remove(current.loans, loanId) })),
    togglePayment: (loanId, paymentNumber) => setState((current) => ({
      ...current,
      loans: loanService.togglePayment(current.loans, loanId, paymentNumber, today),
    })),
    addMember: (name) => setState((current) => ({ ...current, members: memberService.add(current.members, name) })),
    deactivateMember: (memberId) => setState((current) => ({ ...current, members: memberService.deactivate(current.members, memberId) })),
    toggleContribution: (member, month) => setState((current) => ({
      ...current,
      contributions: contributionService.toggle(current.contributions, member, month, today),
    })),
    markAllContributions: (members, month) => setState((current) => ({
      ...current,
      contributions: contributionService.markAll(current.contributions, members, month, today),
    })),
    resetAll: () => {
      localStorageAdapter.clear()
      setState(initialState)
    },
  }), [state, loaded])

  return <FundContext.Provider value={value}>{children}</FundContext.Provider>
}

export function useFundStore() {
  const context = useContext(FundContext)
  if (!context) throw new Error('useFundStore must be used inside FundProvider')
  return context
}
