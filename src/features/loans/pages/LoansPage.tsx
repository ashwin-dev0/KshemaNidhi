import { Landmark } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Header } from '../../../components/layout/Header'
import { Card } from '../../../components/ui/Card'
import { useFundStore } from '../../../store/fundStore'
import { getDashboardTotals } from '../../dashboard/utils/dashboardCalculations'
import type { Loan, PaymentRow } from '../types/loan.types'
import { LoanForm } from '../components/LoanForm'
import { LoanCard } from '../components/LoanCard'
import { PaymentConfirmationModal } from '../components/PaymentConfirmationModal'
import { useLoans } from '../hooks/useLoans'

export function LoansPage() {
  const { loans, members, addLoan, deleteLoan, togglePayment } = useLoans()
  const store = useFundStore()
  const totals = useMemo(()=>getDashboardTotals({openingFund:store.openingFund,loans:store.loans,members:store.members,contributions:store.contributions}),[store.openingFund,store.loans,store.members,store.contributions])
  const [confirmation,setConfirmation]=useState<{loan:Loan;payment:PaymentRow}|null>(null)
  return <>
    <Header title="Loans" description="Create loan schedules, track repayments and see every installment clearly on any screen size."/>
    <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)] 2xl:grid-cols-[420px_minmax(0,1fr)]">
      <div className="xl:sticky xl:top-8 xl:self-start"><LoanForm members={members} availableFund={totals.available} onCreate={addLoan}/></div>
      <section className="min-w-0 space-y-4">{loans.length===0?<Card className="grid min-h-72 place-items-center p-8 text-center"><div><Landmark className="mx-auto text-slate-300" size={42}/><h2 className="mt-4 font-bold">No loans added</h2><p className="mt-1 text-sm text-slate-500">Create the first loan to see its repayment schedule.</p></div></Card>:loans.map((loan)=><LoanCard key={loan.id} loan={loan} onDelete={()=>{if(window.confirm(`Delete the loan record for ${loan.name}?`))deleteLoan(loan.id)}} onPayment={(payment)=>setConfirmation({loan,payment})}/>)}</section>
    </div>
    <PaymentConfirmationModal value={confirmation} onClose={()=>setConfirmation(null)} onConfirm={()=>{if(confirmation)togglePayment(confirmation.loan.id,confirmation.payment.number);setConfirmation(null)}}/>
  </>
}
