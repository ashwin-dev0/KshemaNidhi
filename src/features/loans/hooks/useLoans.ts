import { useFundStore } from '../../../store/fundStore'
export function useLoans() {
  const store = useFundStore()
  return {
    loans: store.loans,
    members: store.members.filter((member) => member.active),
    addLoan: store.addLoan,
    deleteLoan: store.deleteLoan,
    togglePayment: store.togglePayment,
  }
}
