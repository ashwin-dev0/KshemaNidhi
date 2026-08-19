import { Plus } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Header } from '../../../components/layout/Header'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { useFundStore } from '../../../store/fundStore'
import { currentMonth, monthLabel } from '../../../utils/dates'
import { ContributionConfirmationModal, type ContributionConfirmation } from '../components/ContributionConfirmationModal'
import { ContributionSummary } from '../components/ContributionSummary'
import { ContributionTable } from '../components/ContributionTable'
import { useContributions } from '../hooks/useContributions'

export function ContributionsPage() {
  const [month,setMonth]=useState(currentMonth)
  const [memberName,setMemberName]=useState('')
  const [confirmation,setConfirmation]=useState<ContributionConfirmation|null>(null)
  const store=useFundStore()
  const data=useContributions(month)

  function addMember(e: FormEvent){e.preventDefault();if(!memberName.trim())return;store.addMember(memberName);setMemberName('')}
  function removeMember(memberId:string,name:string){if(window.confirm(`Remove ${name} from active members? Existing contribution history will be retained.`))store.deactivateMember(memberId)}

  return <>
    <Header title="Monthly Contributions" description="Track the monthly member amount individually or mark every pending member in one action."/>
    <Card className="mb-5 p-5 sm:p-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[260px_minmax(320px,1fr)_auto] xl:items-end">
        <label><span className="mb-2 block text-sm font-semibold">Contribution month</span><Input type="month" value={month} onChange={(e)=>setMonth(e.target.value)}/></label>
        <form onSubmit={addMember}><span className="mb-2 block text-sm font-semibold">Add member</span><div className="flex gap-2"><Input value={memberName} onChange={(e)=>setMemberName(e.target.value)} placeholder="Member name"/><Button type="submit" className="shrink-0 px-3 sm:px-4"><Plus size={17}/><span className="hidden sm:inline">Add</span></Button></div></form>
        <Button className="w-full xl:w-auto" disabled={data.pendingMembers.length===0} onClick={()=>setConfirmation({type:'ALL',members:data.pendingMembers,month})}>Mark all pending received</Button>
      </div>
      <p className="mt-3 text-xs text-slate-400">Viewing {monthLabel(month)}</p>
    </Card>
    <ContributionSummary expected={data.expected} received={data.received} pending={data.pending} count={data.activeMembers.length}/>
    <div className="mt-5">{data.activeMembers.length===0?<Card className="p-8 text-center"><h2 className="font-bold">No active members</h2><p className="mt-1 text-sm text-slate-500">Add members above to start tracking monthly contributions.</p></Card>:<ContributionTable members={data.activeMembers} receivedIds={data.receivedIds} onToggle={(member)=>setConfirmation({type:'SINGLE',member,month,received:data.receivedIds.has(member.id)})} onRemove={(m)=>removeMember(m.id,m.name)}/>}</div>
    <ContributionConfirmationModal value={confirmation} onClose={()=>setConfirmation(null)} onConfirm={()=>{if(!confirmation)return;if(confirmation.type==='SINGLE')data.toggleContribution(confirmation.member,confirmation.month);else data.markAllContributions(confirmation.members,confirmation.month);setConfirmation(null)}}/>
  </>
}
