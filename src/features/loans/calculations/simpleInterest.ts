import type { PaymentRow } from '../types/loan.types'
import { addMonths } from '../../../utils/dates'

const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100

export function buildSimpleSchedule(principal: number, installments: number, annualRate: number, loanDate: string): PaymentRow[] {
  const monthlyInterest = roundMoney(principal * (annualRate / 100 / 12))
  const rows: PaymentRow[] = []

  for (let index = 1; index <= installments; index += 1) {
    rows.push({
      number: index,
      label: `Interest ${index}`,
      dueDate: addMonths(loanDate, index),
      openingPrincipal: principal,
      principalDue: 0,
      interestCalculated: monthlyInterest,
      amountDue: monthlyInterest,
      paid: false,
    })
  }

  rows.push({
    number: installments + 1,
    label: 'Principal repayment',
    dueDate: addMonths(loanDate, installments + 1),
    openingPrincipal: principal,
    principalDue: principal,
    interestCalculated: 0,
    amountDue: principal,
    paid: false,
  })
  return rows
}
