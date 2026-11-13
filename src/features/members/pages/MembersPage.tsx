import { Plus, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useDialog } from '../../../components/ui/DialogProvider'
import { Header } from '../../../components/layout/Header'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { useFundStore } from '../../../store/fundStore'
import { money } from '../../../utils/currency'
import { dateLabel, monthLabel } from '../../../utils/dates'
import { MemberList } from '../components/MemberList'
import type { Member } from '../types/member.types'

export function MembersPage() {
  const { confirm } = useDialog()
  const store = useFundStore()
  const [name, setName] = useState('')
  const [view, setView] = useState<'active' | 'inactive'>('active')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const active = store.members.filter(member => member.active)
  const inactive = store.members.filter(member => !member.active)
  const selected = store.members.find(member => member.id === selectedId)

  async function addMember() {
    const memberName = name.trim()
    if (!memberName) return
    if (!await confirm({ title: 'Add new member?', description: `Add ${memberName} as an active member of the family fund?`, confirmLabel: 'Add member' })) return
    if (await store.addMember(memberName)) { setName(''); setView('active') }
  }

  async function deactivate(member: Member) {
    if (await confirm({ title: 'Deactivate member?', description: `${member.name} will move to Inactive members. All previous loans, repayments, and contributions will remain available in their history.`, confirmLabel: 'Deactivate member', danger: true })) await store.deactivateMember(member.id)
  }

  if (selected) {
    const loans = store.loans.filter(loan => loan.memberId === selected.id)
    const contributions = store.contributions.filter(item => item.memberId === selected.id).sort((a, b) => b.month.localeCompare(a.month))
    const payments = loans.flatMap(loan => loan.schedule.filter(row => row.paid).map(row => ({ ...row, loanId: loan.id })))
    return <>
      <Header title={selected.name} description={selected.active ? 'Active member ? Loan, repayment, and contribution history.' : 'Inactive member ? Previous records are preserved for reference.'} />
      <Button variant="secondary" className="mb-5" onClick={() => setSelectedId(null)}><ArrowLeft size={16} />Back to members</Button>
      <div className="grid gap-5">
        <Card className="overflow-hidden"><h2 className="p-5 font-bold">Loans ({loans.length})</h2><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="px-5 py-3">Loan date</th><th className="px-5 py-3">Principal</th><th className="px-5 py-3">Outstanding</th><th className="px-5 py-3">Status</th></tr></thead><tbody>{loans.map(loan => {
          const due = loan.schedule.filter(row => !row.paid).reduce((sum, row) => sum + row.amountDue, 0)
          return <tr key={loan.id} className="border-t border-slate-100"><td className="px-5 py-4">{dateLabel(loan.date)}</td><td className="px-5 py-4">{money(loan.principal)}</td><td className="px-5 py-4">{money(due)}</td><td className="px-5 py-4">{due > 0 ? 'Outstanding' : 'Completed'}</td></tr>
        })}</tbody></table></div>{!loans.length && <p className="px-5 pb-5 text-sm text-slate-500">No loan records.</p>}</Card>
        <Card className="overflow-hidden"><h2 className="p-5 font-bold">Repayments ({payments.length})</h2><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="px-5 py-3">Paid date</th><th className="px-5 py-3">Installment</th><th className="px-5 py-3">Amount</th></tr></thead><tbody>{payments.map(row => <tr key={`${row.loanId}-${row.number}`} className="border-t border-slate-100"><td className="px-5 py-4">{dateLabel(row.paidDate || row.dueDate)}</td><td className="px-5 py-4">{row.label}</td><td className="px-5 py-4">{money(row.amountDue)}</td></tr>)}</tbody></table></div>{!payments.length && <p className="px-5 pb-5 text-sm text-slate-500">No repayments recorded.</p>}</Card>
        <Card className="overflow-hidden"><h2 className="p-5 font-bold">Contributions ({contributions.length})</h2><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="px-5 py-3">Month</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Received date</th></tr></thead><tbody>{contributions.map(item => <tr key={item.id} className="border-t border-slate-100"><td className="px-5 py-4">{monthLabel(item.month)}</td><td className="px-5 py-4">{money(item.amount)}</td><td className="px-5 py-4">{item.received ? 'Received' : 'Pending'}</td><td className="px-5 py-4">{item.receivedDate ? dateLabel(item.receivedDate) : '?'}</td></tr>)}</tbody></table></div>{!contributions.length && <p className="px-5 pb-5 text-sm text-slate-500">No contribution records.</p>}</Card>
      </div>
    </>
  }

  return <>
    <Header title="Members" description="Manage active members and view previous records for inactive members." />
    <Card className="mb-5 p-5 sm:p-6"><form className="flex flex-col gap-3 sm:flex-row" onSubmit={event => event.preventDefault()}><Input value={name} onChange={event => setName(event.target.value)} placeholder="New member name" aria-label="New member name" /><Button className="sm:shrink-0" type="button" disabled={!name.trim() || store.busy} onClick={addMember}><Plus size={17} />Add member</Button></form></Card>
    <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Member status"><Button variant={view === 'active' ? 'primary' : 'secondary'} aria-pressed={view === 'active'} onClick={() => setView('active')}>Active ({active.length})</Button><Button variant={view === 'inactive' ? 'primary' : 'secondary'} aria-pressed={view === 'inactive'} onClick={() => setView('inactive')}>Inactive ({inactive.length})</Button></div>
    <MemberList members={view === 'active' ? active : inactive} inactive={view === 'inactive'} onRemove={deactivate} onView={member => setSelectedId(member.id)} />
  </>
}
