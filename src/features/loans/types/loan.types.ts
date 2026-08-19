import type { Id, ISODate } from '../../../types/common.types'

export type InterestMethod = 'REDUCING' | 'SIMPLE'

export type PaymentRow = {
  number: number
  label: string
  dueDate: ISODate
  openingPrincipal: number
  principalDue: number
  interestCalculated: number
  amountDue: number
  paid: boolean
  paidDate?: ISODate
}

export type Loan = {
  id: Id
  memberId?: Id
  name: string
  date: ISODate
  principal: number
  installments: number
  annualRate: number
  method: InterestMethod
  schedule: PaymentRow[]
  createdAt: string
}
