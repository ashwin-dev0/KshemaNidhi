import { Trash2, Users } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import type { Member } from '../types/member.types'
export function MemberList({ members, onRemove }: { members:Member[]; onRemove:(member:Member)=>void }) {
  if(!members.length)return <Card className="p-10 text-center"><Users className="mx-auto text-slate-300" size={40}/><h2 className="mt-3 font-bold">No active members</h2></Card>
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{members.map(m=><Card key={m.id} className="flex items-center gap-3 p-4"><div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 font-extrabold text-emerald-700">{m.name.slice(0,1).toUpperCase()}</div><div className="min-w-0 flex-1"><div className="truncate font-bold">{m.name}</div><div className="text-xs text-slate-400">Active member</div></div><Button variant="ghost" className="px-3" onClick={()=>onRemove(m)}><Trash2 size={16}/></Button></Card>)}</div>
}
