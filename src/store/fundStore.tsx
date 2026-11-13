import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { FundState } from '../types/fund.types'
import type { Loan } from '../features/loans/types/loan.types'
import type { Member } from '../features/members/types/member.types'
import { apiClient } from '../services/api/apiClient'
import { useAuth } from '../features/auth/AuthProvider'
type FundContextValue = FundState & {
  loaded: boolean; busy: boolean; error: string; reload: () => void
  addLoan: (loan: Loan) => Promise<boolean>
  deleteLoan: (id: string) => Promise<boolean>
  togglePayment: (id: string, number: number) => Promise<boolean>
  addMember: (name: string) => Promise<boolean>
  deactivateMember: (id: string) => Promise<boolean>
  toggleContribution: (member: Member, month: string) => Promise<boolean>
  markAllContributions: (members: Member[], month: string) => Promise<boolean>
}
const initialState: FundState = { loans: [], members: [], contributions: [] }
const FundContext = createContext<FundContextValue | null>(null)
export function FundProvider({ children }: { children: ReactNode }) {
  const { signedIn } = useAuth()
  const [state, setState] = useState(initialState)
  const [loaded, setLoaded] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  const inFlight = useRef(false)
  const generation = useRef(0)
  useEffect(() => {
    const current = ++generation.current
    setState(initialState)
    setLoaded(false)
    setError('')
    if (!signedIn) return
    apiClient.get<FundState>('/fund').then(data => {
      if (current === generation.current) { setState(data); setLoaded(true) }
    }).catch(error => { if (current === generation.current) setError(error.message) })
    return () => { generation.current++ }
  }, [signedIn, revision])
  async function mutate(request: () => Promise<FundState>) {
    if (inFlight.current || !loaded) return false
    const current = generation.current
    inFlight.current = true
    setBusy(true)
    setError('')
    try {
      const data = await request()
      if (current === generation.current) setState(data)
      return true
    } catch (error) {
      if (current === generation.current) setError(error instanceof Error ? error.message : 'Unable to save changes.')
      return false
    } finally { inFlight.current = false; setBusy(false) }
  }
  const value: FundContextValue = {
    ...state, loaded, busy, error, reload: () => setRevision(value => value + 1),
    addLoan: loan => mutate(() => apiClient.post('/loans', { memberId: loan.memberId, date: loan.date, principal: loan.principal, installments: loan.installments, method: loan.method })),
    deleteLoan: id => mutate(() => apiClient.delete(`/loans/${id}`)),
    togglePayment: (id, number) => {
      const row = state.loans.find(loan => loan.id === id)?.schedule.find(row => row.number === number)
      return row ? mutate(() => apiClient.put(`/loans/${id}/payments/${number}`, { paid: !row.paid })) : Promise.resolve(false)
    },
    addMember: name => mutate(() => apiClient.post('/members', { name })),
    deactivateMember: id => mutate(() => apiClient.delete(`/members/${id}`)),
    toggleContribution: (member, month) => mutate(() => apiClient.put('/contributions', { memberIds: [member.id], month, received: !state.contributions.find(item => item.memberId === member.id && item.month === month)?.received })),
    markAllContributions: (members, month) => mutate(() => apiClient.put('/contributions', { memberIds: members.map(member => member.id), month, received: true })),
  }
  return <FundContext.Provider value={value}>{children}</FundContext.Provider>
}
export function useFundStore() {
  const context = useContext(FundContext)
  if (!context) throw new Error('useFundStore must be used inside FundProvider')
  return context
}
