import type { Loan } from '../types/loan.types'

export const loanService = {
  create(current: Loan[], loan: Loan) {
    return [loan, ...current]
  },
  remove(current: Loan[], loanId: string) {
    return current.filter((loan) => loan.id !== loanId)
  },
  togglePayment(current: Loan[], loanId: string, paymentNumber: number, paidDate: string) {
    return current.map((loan) => loan.id !== loanId ? loan : {
      ...loan,
      schedule: loan.schedule.map((row) => row.number !== paymentNumber ? row : {
        ...row,
        paid: !row.paid,
        paidDate: row.paid ? undefined : paidDate,
      }),
    })
  },
}
