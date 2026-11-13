import type { FundState, FundTransaction } from '../../../types/fund.types'
import { expectedInterestForLoan, interestReceivedForLoan } from '../../loans/calculations'

export function buildFundTransactions(state: FundState): FundTransaction[] {
  const transactions: FundTransaction[] = []

  state.loans.forEach((loan) => {
    transactions.push({ id: `loan-${loan.id}`, type: 'LOAN_DISBURSEMENT', amount: -loan.principal, date: loan.date, memberId: loan.memberId, loanId: loan.id, description: `Loan disbursed to ${loan.name}` })
    loan.schedule.filter((row) => row.paid).forEach((row) => {
      const principal = row.principalDue
      const interest = row.amountDue - principal
      if (principal) transactions.push({ id: `${loan.id}-${row.number}-p`, type: 'PRINCIPAL_REPAYMENT', amount: principal, date: row.paidDate || row.dueDate, memberId: loan.memberId, loanId: loan.id, description: `Principal repayment from ${loan.name}` })
      if (interest) transactions.push({ id: `${loan.id}-${row.number}-i`, type: 'INTEREST_PAYMENT', amount: interest, date: row.paidDate || row.dueDate, memberId: loan.memberId, loanId: loan.id, description: `Interest payment from ${loan.name}` })
    })
  })

  state.contributions.filter((item) => item.received).forEach((item) => {
    transactions.push({ id: `contribution-${item.id}`, type: 'CONTRIBUTION', amount: item.amount, date: item.receivedDate || `${item.month}-01`, memberId: item.memberId, description: 'Monthly member contribution' })
  })
  return transactions
}

export function getDashboardTotals(state: FundState) {
  const transactions = buildFundTransactions(state)
  const available = transactions.reduce((sum, item) => sum + item.amount, 0)
  const disbursed = state.loans.reduce((sum, loan) => sum + loan.principal, 0)
  const repaymentsReceived = state.loans.reduce((sum, loan) => sum + loan.schedule.filter((row) => row.paid).reduce((subtotal, row) => subtotal + row.amountDue, 0), 0)
  const totalDue = state.loans.reduce((sum, loan) => sum + loan.schedule.reduce((subtotal, row) => subtotal + row.amountDue, 0), 0)
  const contributionReceived = state.contributions.filter((item) => item.received).reduce((sum, item) => sum + item.amount, 0)
  const totalInterest = state.loans.reduce((sum, loan) => sum + expectedInterestForLoan(loan), 0)
  const interestReceived = state.loans.reduce((sum, loan) => sum + interestReceivedForLoan(loan), 0)
  return {
    available,
    disbursed,
    repaymentsReceived,
    contributionReceived,
    totalInterest,
    interestReceived,
    interestPending: Math.max(0, totalInterest - interestReceived),
    outstanding: Math.max(0, totalDue - repaymentsReceived),
  }
}
