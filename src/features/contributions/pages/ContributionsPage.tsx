import { useState } from 'react'
import { Header } from '../../../components/layout/Header'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { currentMonth, monthLabel } from '../../../utils/dates'
import { ContributionConfirmationModal, type ContributionConfirmation } from '../components/ContributionConfirmationModal'
import { ContributionSummary } from '../components/ContributionSummary'
import { ContributionTable } from '../components/ContributionTable'
import { useContributions } from '../hooks/useContributions'

export function ContributionsPage() {
  const [month,setMonth]=useState(currentMonth)
  const [confirmation,setConfirmation]=useState<ContributionConfirmation|null>(null)
  const data=useContributions(month)

  return <>
    <Header title="Monthly Contributions" description="Track the monthly member amount individually or mark every pending member in one action."/>
    <Card className="mb-5 p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,260px)_auto] sm:items-end sm:justify-between">
        <label><span className="mb-2 block text-sm font-semibold">Contribution month</span><Input type="month" value={month} onChange={(e)=>setMonth(e.target.value)}/></label>
        <Button className="w-full sm:w-auto" disabled={data.pendingMembers.length===0} onClick={()=>setConfirmation({type:'ALL',members:data.pendingMembers,month})}>Mark all pending received</Button>
      </div>
      <p className="mt-3 text-xs text-slate-400">Viewing {monthLabel(month)}</p>
    </Card>
    <ContributionSummary expected={data.expected} received={data.received} pending={data.pending} count={data.activeMembers.length}/>
    <div className="mt-5">{data.activeMembers.length===0?<Card className="p-8 text-center"><h2 className="font-bold">No active members</h2><p className="mt-1 text-sm text-slate-500">Add members on the Members page to start tracking monthly contributions.</p></Card>:<ContributionTable members={data.activeMembers} receivedIds={data.receivedIds} onToggle={(member)=>setConfirmation({type:'SINGLE',member,month,received:data.receivedIds.has(member.id)})}/>}</div>
    <ContributionConfirmationModal value={confirmation} onClose={()=>setConfirmation(null)} onConfirm={()=>{if(!confirmation)return;if(confirmation.type==='SINGLE')data.toggleContribution(confirmation.member,confirmation.month);else data.markAllContributions(confirmation.members,confirmation.month);setConfirmation(null)}}/>
  </>
}
