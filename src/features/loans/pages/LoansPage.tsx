import { useDialog } from '../../../components/ui/DialogProvider'
import { ArrowLeft, Landmark, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Header } from '../../../components/layout/Header'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { useFundStore } from '../../../store/fundStore'
import { getDashboardTotals } from '../../dashboard/utils/dashboardCalculations'
import type { Loan, PaymentRow } from '../types/loan.types'
import { LoanForm } from '../components/LoanForm'
import { LoanCard } from '../components/LoanCard'
import { PaymentConfirmationModal } from '../components/PaymentConfirmationModal'
import { useLoans } from '../hooks/useLoans'

function hasOutstandingBalance(loan: Loan) {
  return loan.schedule.some(row => !row.paid && row.amountDue > 0)
}

export function LoansPage() {
  const { confirm } = useDialog()
  const { loans, members, addLoan, deleteLoan, togglePayment } = useLoans()
  const store = useFundStore()
  const totals = useMemo(() => getDashboardTotals(store), [store.loans, store.members, store.contributions])
  const [adding, setAdding] = useState(false)
  const [view, setView] = useState<'outstanding' | 'completed'>('outstanding')
  const [confirmation, setConfirmation] = useState<{ loan: Loan; payment: PaymentRow } | null>(null)
  const outstanding = loans.filter(hasOutstandingBalance)
  const completed = loans.filter(loan => !hasOutstandingBalance(loan))
  const visibleLoans = view === 'outstanding' ? outstanding : completed

  async function createLoan(loan: Loan) {
    const saved = await addLoan(loan)
    if (saved) { setAdding(false); setView('outstanding') }
    return saved
  }

  return <>
    <Header title={adding ? 'Add new loan' : 'Loans'} description={adding ? 'Select a member and enter loan details to create a repayment schedule.' : 'View outstanding loans and track repayments.'} />
    {adding ? <>
      <Button variant="secondary" onClick={() => setAdding(false)} className="mb-5"><ArrowLeft size={17} />Back to loans</Button>
      <div className="max-w-2xl"><LoanForm members={members} availableFund={totals.available} onCreate={createLoan} /></div>
    </> : <>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Loan status">
          <Button variant={view === 'outstanding' ? 'primary' : 'secondary'} aria-pressed={view === 'outstanding'} onClick={() => setView('outstanding')}>Outstanding loans ({outstanding.length})</Button>
          <Button variant={view === 'completed' ? 'primary' : 'secondary'} aria-pressed={view === 'completed'} onClick={() => setView('completed')}>Completed ({completed.length})</Button>
        </div>
        <Button onClick={() => setAdding(true)}><Plus size={17} />Add new loan</Button>
      </div>
      <section aria-label={view === 'outstanding' ? 'Outstanding loans' : 'Completed loans'} className="min-w-0 space-y-4">
        {visibleLoans.length === 0 ? <Card className="grid min-h-72 place-items-center p-8 text-center"><div>
          <Landmark className="mx-auto text-slate-300" size={42} />
          <h2 className="mt-4 font-bold">{view === 'outstanding' ? 'No outstanding loans' : 'No completed loans'}</h2>
          <p className="mt-1 text-sm text-slate-500">{view === 'outstanding' ? 'New loans with unpaid amounts will appear here.' : 'Fully repaid loans will appear here for your records.'}</p>
        </div></Card> : visibleLoans.map(loan => <LoanCard key={loan.id} loan={loan} onDelete={async () => {
          if (await confirm({ title: 'Delete loan?', description: `Delete the loan record for ${loan.name}? This will also remove its repayment history and update the fund balance.`, confirmLabel: 'Delete loan', danger: true })) void deleteLoan(loan.id)
        }} onPayment={payment => setConfirmation({ loan, payment })} />)}
      </section>
    </>}
    <PaymentConfirmationModal value={confirmation} onClose={() => setConfirmation(null)} onConfirm={async () => {
      if (confirmation && await togglePayment(confirmation.loan.id, confirmation.payment.number)) setConfirmation(null)
    }} />
  </>
}
