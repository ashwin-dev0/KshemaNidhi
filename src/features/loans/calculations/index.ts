import type { InterestMethod, PaymentRow } from '../types/loan.types'
import { buildReducingSchedule } from './reducingInterest'
import { buildSimpleSchedule } from './simpleInterest'

export function buildLoanSchedule(method: InterestMethod, principal: number, installments: number, annualRate: number, loanDate: string): PaymentRow[] {
  return method === 'SIMPLE'
    ? buildSimpleSchedule(principal, installments, annualRate, loanDate)
    : buildReducingSchedule(principal, installments, annualRate, loanDate)
}

export function expectedInterestForLoan(loan: { method: InterestMethod; installments: number; schedule: PaymentRow[] }) {
  if (loan.method === 'SIMPLE') return loan.schedule.reduce((sum, row) => sum + row.interestCalculated, 0)
  return loan.schedule.filter((row) => row.number <= loan.installments).reduce((sum, row) => sum + row.interestCalculated, 0)
}

export function interestReceivedForLoan(loan: { method: InterestMethod; installments: number; schedule: PaymentRow[] }) {
  if (loan.method === 'SIMPLE') {
    return loan.schedule.filter((row) => row.paid && row.number <= loan.installments).reduce((sum, row) => sum + row.interestCalculated, 0)
  }
  const finalInterestRow = loan.schedule.find((row) => row.number === loan.installments + 1)
  return finalInterestRow?.paid ? finalInterestRow.amountDue : 0
}
