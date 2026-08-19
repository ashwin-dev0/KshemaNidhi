import { Banknote, CalendarDays, CheckCircle2, Landmark, PiggyBank, TrendingUp, Users } from 'lucide-react'
import { Header } from '../../../components/layout/Header'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { FUND_CONFIG } from '../../../config/fund.config'
import { useFundStore } from '../../../store/fundStore'
import { money } from '../../../utils/currency'
import { InterestBreakdown } from '../components/InterestBreakdown'
import { StatCard } from '../components/StatCard'
import { useDashboard } from '../hooks/useDashboard'

export function DashboardPage() {
  const { totals, state } = useDashboard()
  const { setOpeningFund } = useFundStore()
  return <>
    <Header title="Dashboard" description="A clear view of available money, loans, contributions, repayments and interest." />
    <Card className="mb-5 p-5 sm:p-6">
      <div className="grid gap-5 md:grid-cols-[1fr_280px] md:items-end">
        <div><div className="flex items-center gap-2 font-bold text-slate-950"><Landmark size={19}/> Opening fund</div><p className="mt-1 text-sm leading-6 text-slate-500">The amount available before loans, repayments and monthly contributions are counted.</p></div>
        <label><span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Opening amount</span><div className="relative"><span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">₹</span><Input className="pl-8" type="number" min="0" step="0.01" value={state.openingFund || ''} onChange={(e) => setOpeningFund(Number(e.target.value))} placeholder="500000"/></div></label>
      </div>
    </Card>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      <StatCard emphasis icon={<PiggyBank size={20}/>} label="Available fund" value={money(totals.available)} note="Current usable balance"/>
      <StatCard icon={<Banknote size={20}/>} label="Disbursed" value={money(totals.disbursed)}/>
      <StatCard icon={<CheckCircle2 size={20}/>} label="Repayments" value={money(totals.repaymentsReceived)}/>
      <StatCard icon={<Users size={20}/>} label="Contributions" value={money(totals.contributionReceived)} note={`₹${FUND_CONFIG.monthlyContribution.toLocaleString('en-IN')} / member`}/>
      <StatCard icon={<TrendingUp size={20}/>} label="Interest received" value={money(totals.interestReceived)}/>
      <StatCard icon={<CalendarDays size={20}/>} label="Interest pending" value={money(totals.interestPending)}/>
    </section>
    <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
      <InterestBreakdown loans={state.loans}/>
      <Card className="p-5 sm:p-6"><h2 className="font-bold text-slate-950">Fund snapshot</h2><div className="mt-5 space-y-4 text-sm">{[['Active members', state.members.filter(m=>m.active).length.toString()],['Active loan records', state.loans.length.toString()],['Outstanding receivable', money(totals.outstanding)],['Total expected interest', money(totals.totalInterest)]].map(([a,b]) => <div key={a} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0"><span className="text-slate-500">{a}</span><strong className="text-right text-slate-900">{b}</strong></div>)}</div></Card>
    </div>
  </>
}
