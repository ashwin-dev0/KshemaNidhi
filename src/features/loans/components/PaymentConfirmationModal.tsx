import { CheckCircle2 } from 'lucide-react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { dateLabel } from '../../../utils/dates'
import { money } from '../../../utils/currency'
import type { Loan, PaymentRow } from '../types/loan.types'

export function PaymentConfirmationModal({ value, onClose, onConfirm }: { value: { loan: Loan; payment: PaymentRow } | null; onClose: () => void; onConfirm: () => void }) {
  if (!value) return null
  const { loan, payment } = value
  return <Modal open title={payment.paid ? 'Mark installment as unpaid?' : 'Mark installment as paid?'} description="Review the payment before changing the fund balance." onClose={onClose} footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={onConfirm}><CheckCircle2 size={17}/>{payment.paid ? 'Yes, mark unpaid' : 'Yes, mark paid'}</Button></>}>
    <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-sm">
      <Detail label="Borrower" value={loan.name}/><Detail label="Installment" value={`${payment.number} of ${loan.installments + 1}`}/><Detail label="Due date" value={dateLabel(payment.dueDate)}/><Detail label="Principal" value={money(payment.principalDue)}/><Detail label="Interest" value={money(payment.interestCalculated)}/><Detail label="Amount payable" value={money(payment.amountDue)} strong/>
    </div>
  </Modal>
}
function Detail({ label, value, strong=false }: { label:string; value:string; strong?:boolean }) { return <div><span className="block text-xs text-slate-500">{label}</span><span className={strong ? 'font-extrabold text-slate-950' : 'font-semibold text-slate-800'}>{value}</span></div> }
