import { Archive, History, Users } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import type { Member } from '../types/member.types'

export function MemberList({ members, inactive = false, onRemove, onView }: { members: Member[]; inactive?: boolean; onRemove: (member: Member) => void; onView: (member: Member) => void }) {
  if (!members.length) return <Card className="p-10 text-center"><Users className="mx-auto text-slate-300" size={40} /><h2 className="mt-3 font-bold">{inactive ? 'No inactive members' : 'No active members'}</h2></Card>
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{members.map(member => <Card key={member.id} className="p-4">
    <div className="flex items-center gap-3"><div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl font-extrabold ${member.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{member.name.slice(0, 1).toUpperCase()}</div><div className="min-w-0 flex-1"><div className="truncate font-bold">{member.name}</div><div className="text-xs text-slate-500">{member.active ? 'Active member' : 'Inactive ? history retained'}</div></div></div>
    <div className="mt-4 flex flex-wrap gap-2"><Button variant="secondary" onClick={() => onView(member)} aria-label={`View history for ${member.name}`}><History size={16} />View history</Button>{member.active && <Button variant="ghost" onClick={() => onRemove(member)} aria-label={`Deactivate ${member.name}`}><Archive size={16} />Deactivate</Button>}</div>
  </Card>)}</div>
}
