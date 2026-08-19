import { CheckCircle2 } from 'lucide-react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { FUND_CONFIG } from '../../../config/fund.config'
import { money } from '../../../utils/currency'
import { monthLabel } from '../../../utils/dates'
import type { Member } from '../../members/types/member.types'

export type ContributionConfirmation = { type:'SINGLE'; member:Member; month:string; received:boolean } | { type:'ALL'; members:Member[]; month:string }

export function ContributionConfirmationModal({ value, onClose, onConfirm }: { value:ContributionConfirmation|null; onClose:()=>void; onConfirm:()=>void }) {
  if(!value)return null
  const all=value.type==='ALL'
  const amount=all?value.members.length*FUND_CONFIG.monthlyContribution:FUND_CONFIG.monthlyContribution
  const title=all?'Mark all pending contributions as received?':value.received?'Undo received contribution?':'Mark contribution as received?'
  return <Modal open title={title} description={`${monthLabel(value.month)} contribution update`} onClose={onClose} footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={onConfirm}><CheckCircle2 size={17}/>{all?`Confirm ${money(amount)}`:value.received?'Mark pending':'Confirm received'}</Button></>}>
    <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">{all?<><strong className="text-slate-950">{value.members.length} members</strong> are pending. Total to add to the fund: <strong className="text-slate-950">{money(amount)}</strong>.</>:<>Member: <strong className="text-slate-950">{value.member.name}</strong><br/>Amount: <strong className="text-slate-950">{money(amount)}</strong></>}</div>
  </Modal>
}
