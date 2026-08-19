import type { PaymentRow } from '../types/loan.types'
import { addMonths } from '../../../utils/dates'

const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100

export function buildReducingSchedule(principal: number, installments: number, annualRate: number, loanDate: string): PaymentRow[] {
  const monthlyRate = annualRate / 100 / 12
  const principalPerMonth = roundMoney(principal / installments)
  let remaining = principal
  let accumulatedInterest = 0
  const rows: PaymentRow[] = []

  for (let index = 1; index <= installments; index += 1) {
    const openingPrincipal = roundMoney(remaining)
    const principalDue = index === installments ? roundMoney(remaining) : principalPerMonth
    const interestCalculated = roundMoney(openingPrincipal * monthlyRate)
    accumulatedInterest = roundMoney(accumulatedInterest + interestCalculated)

    rows.push({
      number: index,
      label: `Principal ${index}`,
      dueDate: addMonths(loanDate, index),
      openingPrincipal,
      principalDue,
      interestCalculated,
      amountDue: principalDue,
      paid: false,
    })
    remaining = roundMoney(Math.max(0, remaining - principalDue))
  }

  rows.push({
    number: installments + 1,
    label: 'Interest settlement',
    dueDate: addMonths(loanDate, installments + 1),
    openingPrincipal: 0,
    principalDue: 0,
    interestCalculated: accumulatedInterest,
    amountDue: accumulatedInterest,
    paid: false,
  })

  return rows
}
