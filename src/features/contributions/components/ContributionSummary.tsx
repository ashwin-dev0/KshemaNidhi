import { Banknote, CheckCircle2, Clock3, Users } from 'lucide-react'
import { FUND_CONFIG } from '../../../config/fund.config'
import { money } from '../../../utils/currency'
import { StatCard } from '../../dashboard/components/StatCard'
export function ContributionSummary({ expected, received, pending, count }: { expected:number; received:number; pending:number; count:number }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard icon={<Users size={19}/>} label="Members" value={count.toString()} note={`${money(FUND_CONFIG.monthlyContribution)} each`}/><StatCard icon={<Banknote size={19}/>} label="Expected" value={money(expected)}/><StatCard icon={<CheckCircle2 size={19}/>} label="Received" value={money(received)}/><StatCard icon={<Clock3 size={19}/>} label="Pending" value={money(pending)}/></div>
}
