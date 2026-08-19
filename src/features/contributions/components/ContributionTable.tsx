import { CheckCircle2, Trash2 } from 'lucide-react'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { FUND_CONFIG } from '../../../config/fund.config'
import { money } from '../../../utils/currency'
import type { Member } from '../../members/types/member.types'

export function ContributionTable({ members, receivedIds, onToggle, onRemove }: { members: Member[]; receivedIds:Set<string>; onToggle:(member:Member)=>void; onRemove:(member:Member)=>void }) {
  return <Card className="overflow-hidden">
    <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-3">Member</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{members.map(m=>{const received=receivedIds.has(m.id);return <tr key={m.id}><td className="px-6 py-4 font-semibold">{m.name}</td><td className="px-6 py-4">{money(FUND_CONFIG.monthlyContribution)}</td><td className="px-6 py-4"><Badge tone={received?'green':'amber'}>{received?'Received':'Pending'}</Badge></td><td className="px-6 py-4"><div className="flex gap-2"><Button variant={received?'secondary':'primary'} onClick={()=>onToggle(m)}>{received?<><CheckCircle2 size={15}/>Received</>:'Mark received'}</Button><Button variant="ghost" className="px-3" onClick={()=>onRemove(m)} aria-label={`Remove ${m.name}`}><Trash2 size={16}/></Button></div></td></tr>})}</tbody></table></div>
    <div className="divide-y divide-slate-100 md:hidden">{members.map(m=>{const received=receivedIds.has(m.id);return <div key={m.id} className="p-4"><div className="flex items-start justify-between gap-3"><div><div className="font-bold">{m.name}</div><div className="mt-1 text-sm text-slate-500">{money(FUND_CONFIG.monthlyContribution)}</div></div><Badge tone={received?'green':'amber'}>{received?'Received':'Pending'}</Badge></div><div className="mt-4 flex gap-2"><Button className="flex-1" variant={received?'secondary':'primary'} onClick={()=>onToggle(m)}>{received?'Received':'Mark received'}</Button><Button variant="ghost" className="px-3" onClick={()=>onRemove(m)}><Trash2 size={16}/></Button></div></div>})}</div>
  </Card>
}
