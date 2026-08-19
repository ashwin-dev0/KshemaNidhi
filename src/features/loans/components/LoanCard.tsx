import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { dateLabel } from '../../../utils/dates'
import { money } from '../../../utils/currency'
import { expectedInterestForLoan } from '../calculations'
import type { Loan, PaymentRow } from '../types/loan.types'
import { LoanSchedule } from './LoanSchedule'

export function LoanCard({ loan, onDelete, onPayment }: { loan: Loan; onDelete: () => void; onPayment: (payment: PaymentRow) => void }) {
  const [expanded, setExpanded] = useState(false)
  const paid = loan.schedule.filter(r=>r.paid).reduce((s,r)=>s+r.amountDue,0)
  const interest = expectedInterestForLoan(loan)
  const totalDue = loan.principal + interest
  const progress = totalDue ? Math.min(100,(paid/totalDue)*100) : 0
  return <Card className="overflow-hidden">
    <button type="button" className="w-full p-4 text-left sm:p-5" onClick={()=>setExpanded(v=>!v)}>
      <div className="flex items-start gap-3 sm:items-center">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 font-extrabold text-slate-700">{loan.name.slice(0,1).toUpperCase()}</div>
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-bold text-slate-950">{loan.name}</h3><Badge tone={loan.method==='REDUCING'?'green':'blue'}>{loan.method==='REDUCING'?'Reducing':'Simple'}</Badge></div><p className="mt-1 text-xs text-slate-500">{dateLabel(loan.date)} · {loan.installments} installments · {loan.annualRate}% p.a.</p></div>
        <div className="hidden text-right sm:block"><strong className="block">{money(loan.principal)}</strong><span className="text-xs text-slate-500">Interest {money(interest)}</span></div>
        {expanded?<ChevronUp size={19}/>:<ChevronDown size={19}/>}
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{width:`${progress}%`}}/></div>
      <div className="mt-2 flex justify-between gap-4 text-xs text-slate-500"><span>Received {money(paid)}</span><span className="text-right">Due {money(Math.max(0,totalDue-paid))}</span></div>
    </button>
    {expanded && <div className="border-t border-slate-100">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><div className="text-sm text-slate-600"><strong className="text-slate-950">Total repayment:</strong> {money(totalDue)} <span className="mx-1 text-slate-300">•</span> <strong className="text-slate-950">Interest:</strong> {money(interest)}</div><Button variant="danger" onClick={onDelete}><Trash2 size={16}/>Delete</Button></div>
      <LoanSchedule loan={loan} onPayment={onPayment}/>
    </div>}
  </Card>
}
