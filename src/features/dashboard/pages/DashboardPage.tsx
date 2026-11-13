import { Banknote, CalendarDays, CheckCircle2, PiggyBank, TrendingUp, Users } from 'lucide-react'
import { Header } from '../../../components/layout/Header'
import { Card } from '../../../components/ui/Card'
import { FUND_CONFIG } from '../../../config/fund.config'
import { money } from '../../../utils/currency'
import { InterestBreakdown } from '../components/InterestBreakdown'
import { StatCard } from '../components/StatCard'
import { useDashboard } from '../hooks/useDashboard'

export function DashboardPage() {
  const { totals, state } = useDashboard()
  return <>
    <Header title="Dashboard" description="A clear view of available money, loans, contributions, repayments and interest." />
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
