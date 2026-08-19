import type { Loan } from '../features/loans/types/loan.types'
import type { Member } from '../features/members/types/member.types'
import type { Contribution } from '../features/contributions/types/contribution.types'

export type FundState = {
  openingFund: number
  loans: Loan[]
  members: Member[]
  contributions: Contribution[]
}

export type FundTransactionType =
  | 'OPENING_BALANCE'
  | 'CONTRIBUTION'
  | 'LOAN_DISBURSEMENT'
  | 'PRINCIPAL_REPAYMENT'
  | 'INTEREST_PAYMENT'

export type FundTransaction = {
  id: string
  type: FundTransactionType
  amount: number
  date: string
  memberId?: string
  loanId?: string
  description: string
}
