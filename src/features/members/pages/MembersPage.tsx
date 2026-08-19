import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Header } from '../../../components/layout/Header'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { useFundStore } from '../../../store/fundStore'
import { MemberList } from '../components/MemberList'
export function MembersPage(){
  const store=useFundStore(); const [name,setName]=useState(''); const members=store.members.filter(m=>m.active)
  return <><Header title="Members" description="Maintain the people who participate in monthly contributions and can be linked to loans."/><Card className="mb-5 p-5 sm:p-6"><form className="flex flex-col gap-3 sm:flex-row" onSubmit={(e)=>{e.preventDefault();if(!name.trim())return;store.addMember(name);setName('')}}><Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="New member name"/><Button className="sm:shrink-0" type="submit"><Plus size={17}/>Add member</Button></form></Card><MemberList members={members} onRemove={(m)=>{if(window.confirm(`Remove ${m.name} from active members? Existing history remains.`))store.deactivateMember(m.id)}}/></>
}
