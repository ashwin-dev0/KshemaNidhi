import { FUND_CONFIG } from '../../../config/fund.config'
import type { Contribution } from '../types/contribution.types'
import type { Member } from '../../members/types/member.types'

export const contributionService = {
  toggle(current: Contribution[], member: Member, month: string, receivedDate: string) {
    const existing = current.find((item) => item.memberId === member.id && item.month === month)
    if (existing) {
      return current.map((item) => item.id !== existing.id ? item : {
        ...item,
        received: !item.received,
        receivedDate: item.received ? undefined : receivedDate,
      })
    }
    return [...current, {
      id: crypto.randomUUID(),
      memberId: member.id,
      month,
      amount: FUND_CONFIG.monthlyContribution,
      received: true,
      receivedDate,
    }]
  },
  markAll(current: Contribution[], members: Member[], month: string, receivedDate: string) {
    const next = [...current]
    members.forEach((member) => {
      const index = next.findIndex((item) => item.memberId === member.id && item.month === month)
      if (index >= 0) next[index] = { ...next[index], received: true, amount: FUND_CONFIG.monthlyContribution, receivedDate }
      else next.push({ id: crypto.randomUUID(), memberId: member.id, month, amount: FUND_CONFIG.monthlyContribution, received: true, receivedDate })
    })
    return next
  },
}
